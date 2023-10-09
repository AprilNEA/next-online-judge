use crate::{
    model::{UserAuthModel},
    schema::{LoginSchema, RegisterSchema},
    AppState,
};

use bcrypt::{hash, verify};
use actix_web::{get, post, web, HttpResponse, Responder};
use serde_json::json;

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({"status": "success"}))
}


#[post("/login")]
async fn login(body: web::Json<LoginSchema>,
               data: web::Data<AppState>, ) -> impl Responder {
    let user = sqlx::query_as!(
        UserAuthModel,
        r#"
        SELECT id, role as "role: String", email, password FROM public.user WHERE email = $1
        "#,
        body.email
    )
        .fetch_one(&data.db_pool)
        .await;

    match user {
        Ok(user) => {
            // 使用bcrypt验证密码
            if let Ok(is_match) = verify(&body.password, &user.password) {
                if is_match {
                    // 密码验证成功
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


#[post("/register")]
async fn register(body: web::Json<RegisterSchema>,
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

// #[get("/bank")]
// async fn bank() -> impl Responder {}
//
// #[get("/question/{id}")]
// async fn question(
//     path: web::Path<i32>,
// ) -> impl Responder {}
//
// #[post("/submit/{id}")]
// async fn submit(
//     path: web::Path<i32>,
// ) -> impl Responder {}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(health)
        .service(login)
        .service(register);
    // .service(bank)
    // .service(question)
    // .service(submit);
    conf.service(scope);
}