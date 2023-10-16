mod dao;
mod entity;
mod guard;
mod judge;
mod schema;
mod services;
mod utils;

use dotenv::dotenv;

use actix_web::{
    cookie::Key,
    dev::{Payload, ServiceRequest},
    http::header,
    web, App, Error, FromRequest, HttpRequest, HttpServer,
};

use actix_cors::Cors;
use actix_identity::{Identity, IdentityMiddleware};
use actix_session::{storage::RedisActorSessionStore, SessionMiddleware};
use actix_web::error::ErrorUnauthorized;
use actix_web_grants::GrantsMiddleware;

use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use redis::{AsyncCommands, RedisResult};

use crate::dao::{get_submission_by_id, get_user_by_id, update_submission_status};
use crate::entity::{Role, SubmissionStatus};
use crate::utils::parse_user_id;
use sqlx::postgres::{PgPool, PgPoolOptions};

pub struct AppState {
    db_pool: PgPool,
    redis_pool: Pool<RedisConnectionManager>,
}
async fn extract(req: &ServiceRequest) -> Result<Vec<String>, Error> {
    let user = match Identity::from_request(&req.request(), &mut Payload::None).into_inner() {
        Ok(user) => user,
        Err(_) => return Ok(vec![]),
    };
    let data = req.app_data::<web::Data<AppState>>().unwrap();
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();

    if user.role == Role::Admin {
        Ok(vec![String::from("ROLE_ADMIN")])
    } else {
        Err(ErrorUnauthorized("Unauthorized"))
    }
}

async fn start_redis_consumer(db_pool: PgPool) {
    println!("Consumer is right");
    let client = redis::Client::open("redis://localhost:6388/").unwrap();
    let mut conn = client.get_async_connection().await.unwrap();

    loop {
        let task_data: Option<(String, String)> =
            conn.brpop("compile_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                // Handle the task using the data
                println!("Processing task: {}", data);
                let submission_id = data.parse::<i32>().unwrap();
                // let submission = get_submission_by_id(&db_pool);
                // {}

                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect("TODO: panic message");
            }
            None => {}
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url =
        String::from(std::env::var("DATABASE_URL").expect("DATABASE_URL must be set."));
    let redis_url = String::from(std::env::var("REDIS_URL").expect("REDIS_URL must be set."));

    let redis_pool = Pool::builder()
        .build(RedisConnectionManager::new("redis://localhost:6388/").unwrap())
        .await
        .expect("Failed to build connection pool");

    let secret_key = Key::from(
        std::env::var("SECRET_KEY")
            .expect("SECRET_KEY must be set.")
            .as_bytes(),
    );

    // Create a connection pool
    let db_pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            println!("✅ Connection to the database is successful!");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    tokio::spawn(start_redis_consumer(db_pool.clone()));

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("https://noj.xjt.lu")
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![header::ACCEPT, header::CONTENT_TYPE])
            .supports_credentials();
        App::new()
            .wrap(GrantsMiddleware::with_extractor(extract))
            .wrap(IdentityMiddleware::default())
            .wrap(SessionMiddleware::new(
                RedisActorSessionStore::new(&redis_url),
                secret_key.clone(),
            ))
            .app_data(web::Data::new(AppState {
                db_pool: db_pool.clone(),
                redis_pool: redis_pool.clone(),
            }))
            .configure(crate::services::config::config)
            .wrap(cors)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
