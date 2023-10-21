use crate::entity::Role;
use crate::utils::login_with_role;
use crate::{
    entity::user::{UserAuthModel, UserModel},
    error::{AppError, HandleRedisError, HandleSqlxError},
    schema::{
        user::{
            ActiveSchema, CodeRequestSchema, InfoResponse, LoginSchema, RegisterSchema,
            SMSResponse, SMSTempVerifyTTL2, UserStatus, ValidateCodeSchema,
        },
        ResponseBuilder,
    },
    utils::parse_user_id,
    AppState,
};
use actix_identity::Identity;
use actix_session::Session;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder};
use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use bcrypt::{hash, verify};
use chrono::Utc;
use rand::{distributions::Alphanumeric, Rng};
use redis::AsyncCommands;
use regex::Regex;
use reqwest;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// 根据特征提取 email, phone 和 handle
fn parse_account(s: &str) -> &'static str {
    let email_re = Regex::new(r"(?i)^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$").unwrap();
    let china_phone_re = Regex::new(r"^1[0-9]\d{10}$").unwrap();
    if email_re.is_match(s) {
        "email"
    } else if china_phone_re.is_match(s) {
        "phone"
    } else {
        "handle"
    }
}

async fn validate_code(
    redis_pool: &Pool<RedisConnectionManager>,
    account: String,
    code: String,
) -> Result<(), AppError> {
    let mut conn = redis_pool.get().await.unwrap();

    let key = format!("validate_code:{}", account);
    let value: String = conn.get(&key).await.handle_redis_err()?;
    if value == code {
        Ok(())
    } else {
        Err(AppError::ValidateError)
    }
}

/// 这是用户获取用户信息的处理器, 当用户未完成激活时会提示用户激活, 体现在 status 字段中
pub async fn info(
    user: Option<Identity>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    if let Some(user) = user {
        let user = sqlx::query_as::<_, UserModel>(
            r#"
            SELECT id, role, email, phone, handle, password, created_at FROM public.user WHERE id = $1
            "#,
        )
        .bind(parse_user_id(user))
        .fetch_one(&data.db_pool)
        .await
        .handle_sqlx_err()?;

        let mut response = InfoResponse {
            id: user.id.clone(),
            role: user.role.clone(),
            handle: user.handle.clone(),
            status: UserStatus::Normal,
        };

        if let (Some(_handle), Some(_password)) = (&user.handle, &user.password) {
        } else {
            response.status = UserStatus::InActive;
        }

        Ok(HttpResponse::Ok().json(ResponseBuilder::<InfoResponse>::success(response)))
    } else {
        Ok(HttpResponse::Ok().json(ResponseBuilder::<&str>::failed("Not login")))
    }
}

/// 处理用户登录的处理器
pub async fn login(
    request: HttpRequest,
    session: Session,
    body: web::Json<LoginSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let user = sqlx::query_as::<_, UserAuthModel>(&*format!(
        r#"
        SELECT id, role, email, handle, password FROM public.user WHERE {} = $1
        "#,
        parse_account(&body.account)
    ))
    .bind(body.account.clone())
    .fetch_one(&data.db_pool)
    .await
    .handle_sqlx_err()?;

    if let Ok(is_match) = verify(&body.password, &user.password) {
        if is_match {
            login_with_role(
                session,
                &request.extensions(),
                user.id.to_string(),
                user.role,
            )?;
            Ok(HttpResponse::Ok().json(ResponseBuilder::<()>::success_without_data()))
        } else {
            Err(AppError::PasswordError)
        }
    } else {
        Err(AppError::CryptError)
    }
}

pub async fn logout(user: Identity) -> impl Responder {
    user.logout();
    HttpResponse::Ok().json(ResponseBuilder::<()>::success_without_data())
}

#[derive(Debug, Deserialize, Serialize)]
struct CodeTTL {
    ttl: i32,
}

/// 请求验证码，自动识别邮箱和手机号，可用于注册和找回密码
pub async fn code(
    body: web::Json<CodeRequestSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let mut conn = data.redis_pool.get().await.unwrap();
    let key = format!("validate_code:{}", &body.account);
    let exist_ttl: i32 = conn.ttl(&key).await.handle_redis_err()?;
    match exist_ttl {
        ttl if ttl > 240 => {
            return Ok(
                HttpResponse::TooManyRequests().json(ResponseBuilder::<CodeTTL>::failed(CodeTTL {
                    ttl: ttl - 240,
                })),
            );
        }
        _ => (),
    }
    let nonce: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(16)
        .map(char::from)
        .collect();
    let code: u32 = rand::thread_rng().gen_range(100_000..1_000_000);

    let timestamp = Utc::now().timestamp_millis();

    let mut params = BTreeMap::new();
    params.insert("action".to_string(), "sms.message.send".to_string());
    params.insert(
        "accessKeyId".to_string(),
        std::env::var("SMS_ACCESS_ID").expect("SMS_ACCESS_ID must be set."),
    );
    params.insert("algorithm".to_string(), "hmac-sha256".to_string());
    params.insert("timestamp".to_string(), timestamp.to_string());
    params.insert("nonce".to_string(), nonce);

    // let signature = generate_signature(&params);
    // params.insert("signature".to_string(), signature);

    let query_string = params
        .iter()
        .map(|(k, v)| format!("{}={}", k, v))
        .collect::<Vec<String>>()
        .join("&");
    let res_data = ValidateCodeSchema {
        to: body.account.clone(),
        signature: std::env::var("SMS_SIGNATURE")
            .expect("SMS_SIGNATURE must be set.")
            .to_string(),
        template_id: "pub_verif_short2".to_string(),
        template_data: SMSTempVerifyTTL2 { code, ttl: 5 },
    };
    let client = reqwest::Client::new();
    let res = client
        .post(format!("https://uni.apistd.com/?{}", query_string))
        .json(&res_data)
        .send()
        .await
        .map_err(|_e| AppError::SMSRequestError)?
        .json::<SMSResponse>()
        .await
        .map_err(|_e| AppError::SMSRequestError)?;

    if res.code == "0" {
        let _: () = conn.set_ex(&key, code, 300).await.handle_redis_err()?;
        Ok(HttpResponse::Ok().json(ResponseBuilder::<()>::success_without_data()))
    // Return the response if the code is "0".
    } else {
        Err(AppError::SMSRequestError) // Assume you have an SMSError variant in AppError.
    }
}

#[derive(Debug, Deserialize, Serialize)]
struct ActiveSuccess {
    handle: String,
}
/// 用户激活：注册 handle 和 password
pub async fn active(
    identity: Identity,
    body: web::Json<ActiveSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let hashed_password = match hash(&body.password, 4) {
        Ok(h) => h,
        Err(_) => return Ok(HttpResponse::InternalServerError().json("Error hashing password")),
    };

    match sqlx::query!(
        r#"
        UPDATE public.user
        SET handle = $1, password = $2
        WHERE id = $3
        "#,
        &body.handle,
        hashed_password,
        parse_user_id(identity)
    )
    .execute(&data.db_pool)
    .await
    {
        Ok(_) => Ok(
            HttpResponse::Ok().json(ResponseBuilder::<ActiveSuccess>::success(ActiveSuccess {
                handle: body.handle.clone(),
            })),
        ),
        Err(_) => Err(AppError::DatabaseError),
    }
}

/// 用户注册：完成 account 的登记
pub async fn register(
    request: HttpRequest,
    session: Session,
    body: web::Json<RegisterSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    validate_code(&data.redis_pool, body.account.clone(), body.code.clone()).await?;

    let new_user = sqlx::query_as::<_, UserModel>(&*format!(
        r#"
        INSERT INTO public.user {} VALUES $1
        "#,
        parse_account(&body.account)
    ))
    .bind(&body.account)
    .fetch_one(&data.db_pool)
    .await
    .handle_sqlx_err()?;

    login_with_role(
        session,
        &request.extensions(),
        new_user.id.to_string(),
        Role::User,
    )?;
    Ok(HttpResponse::Ok().json(ResponseBuilder::<()>::success_without_data()))
}

/// 用户找回密码
pub async fn forget(
    body: web::Json<RegisterSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
    validate_code(&data.redis_pool, body.account.clone(), body.code.clone()).await?;

    Ok(HttpResponse::Ok().json(ResponseBuilder::<()>::success_without_data()))
}
