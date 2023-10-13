use crate::{model::{UserAuthModel}, schema::{LoginSchema, RegisterSchema}, AppState};


use bcrypt::{hash, verify};
use actix_web::{web, HttpRequest, HttpResponse, Responder, HttpMessage};
use actix_identity::Identity;

pub(crate) async fn login(
    request: HttpRequest,
    body: web::Json<LoginSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
    let user = sqlx::query_as::<_, UserAuthModel>(
        r#"
        SELECT id, role, email, password FROM public.user WHERE email = $1
        "#,
    )
        .bind(body.email.clone())
        .fetch_one(&data.db_pool)
        .await;

    match user {
        Ok(user) => {
            if let Ok(is_match) = verify(&body.password, &user.password) {
                if is_match {
                    Identity::login(&request.extensions(), user.id.to_string()).expect("Unable to attach session");
                    HttpResponse::Ok().json("Logged in successfully")
                } else {
                    HttpResponse::BadRequest().json("Invalid email or password")
                }
            } else {
                HttpResponse::InternalServerError().json("Error verifying password")
            }
        }
        Err(_) => {
            HttpResponse::BadRequest().json("Invalid email or password")
        }
    }
}

pub(crate) async fn register(body: web::Json<RegisterSchema>,
                             data: web::Data<AppState>) -> impl Responder {
    // 对密码进行hash
    let hashed_password = match hash(&body.password, 4) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().json("Error hashing password"),
    };

    // 将用户插入数据库
    let result = sqlx::query_as!(
        UserModel,
        r#"
        INSERT INTO public.user (email, password)
        VALUES ($1, $2)
        "#,
        body.email,
        hashed_password
    )
        .execute(&data.db_pool)
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().json("User registered successfully"),
        Err(_) => HttpResponse::BadRequest().json("Error registering user"),
    }
}