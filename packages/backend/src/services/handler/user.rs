use bcrypt::{hash, verify};
use chrono::Utc;
use rand::{distributions::Alphanumeric, Rng};
use std::collections::BTreeMap;

use actix_identity::Identity;
use actix_web::{web, App, HttpMessage, HttpRequest, HttpResponse, Responder};
use log::Level::Info;
use redis::AsyncCommands;
use reqwest;

use crate::error::AppError;
use crate::schema::user::UserStatus;
use crate::schema::ActiveSchema;
use crate::{
    dao::get_user_by_id,
    entity::user::{UserAuthModel, UserModel},
    schema::{
        user::{InfoResponse, SMSResponse},
        CodeRequestSchema, LoginSchema, RegisterSchema, SMSTempVerifyTTL2, ValidateCodeSchema,
    },
    utils::parse_user_id,
    AppState,
};

pub async fn info(identity: Identity, data: web::Data<AppState>) -> Result<HttpResponse, AppError> {
    let user = sqlx::query_as::<_, UserModel>(
        r#"
        SELECT id, role, email, phone, handle, password, created_at FROM public.user WHERE id = $1
        "#,
    )
    .bind(parse_user_id(identity))
    .fetch_one(&data.db_pool)
    .await
    .map_err(|_e| AppError::DatabaseError)?;

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

    Ok(HttpResponse::Ok().json(response))
}

pub async fn login(
    request: HttpRequest,
    body: web::Json<LoginSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let user = sqlx::query_as::<_, UserAuthModel>(
        r#"
        SELECT id, role, email, handle, password FROM public.user WHERE email = $1
        "#,
    )
    .bind(body.email.clone())
    .fetch_one(&data.db_pool)
    .await;

    match user {
        Ok(user) => {
            if let Ok(is_match) = verify(&body.password, &user.password) {
                if is_match {
                    Identity::login(&request.extensions(), user.id.to_string())
                        .expect("Unable to attach session");
                    HttpResponse::Ok().json("Logged in successfully")
                } else {
                    HttpResponse::BadRequest().json("Invalid email or password")
                }
            } else {
                HttpResponse::InternalServerError().json("Error verifying password")
            }
        }
        Err(e) => HttpResponse::BadRequest().json(format!("Invalid email or password,{}", e)),
    }
}

pub async fn request_code(
    body: web::Json<CodeRequestSchema>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, AppError> {
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
        let mut conn = data.redis_pool.get().await.unwrap();
        let _: () = conn
            .set_ex(&body.account, code, 300)
            .await
            .map_err(|_e| AppError::SMSRequestError)?;
        Ok(HttpResponse::Ok().body("")) // Return the response if the code is "0".
    } else {
        Err(AppError::SMSRequestError) // Assume you have an SMSError variant in AppError.
    }
}

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
        &body.password,
        parse_user_id(identity)
    )
    .execute(&data.db_pool)
    .await
    {
        Ok(_) => Ok(HttpResponse::Ok().body("")),
        Err(_) => Err(AppError::DatabaseError),
    }
}

pub async fn register(
    request: HttpRequest,
    body: web::Json<RegisterSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let new_user = sqlx::query_as::<_, UserModel>(
        r#"
        INSERT INTO public.user (phone)
        VALUES ($1)
        "#,
    )
    .bind(&body.account)
    .fetch_one(&data.db_pool)
    .await;

    match new_user {
        Ok(user) => {
            Identity::login(&request.extensions(), user.id.to_string())
                .expect("Unable to attach session");
            HttpResponse::Ok().json("User registered successfully")
        }
        Err(_) => HttpResponse::BadRequest().json("Error registering user"),
    }
}

pub async fn forget(body: web::Json<RegisterSchema>, data: web::Data<AppState>) {}
