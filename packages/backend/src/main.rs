mod dao;
mod entity;
mod error;
mod guard;
mod schema;
mod services;
mod utils;
mod worker;


use crate::{
    dao::get_user_by_id,
    entity::Role,
    utils::parse_user_id,
    worker::{compile_worker, run_worker},
};
use actix_cors::Cors;
use actix_identity::{Identity, IdentityMiddleware};
use actix_session::{storage::RedisSessionStore, SessionMiddleware};
use actix_web::{
    cookie::Key,
    dev::{Payload, ServiceRequest},
    web, App, Error, FromRequest, HttpServer,
};
use actix_web_grants::GrantsMiddleware;
use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use dotenv::dotenv;
use sqlx::postgres::{PgPool, PgPoolOptions};
use tokio::spawn;

pub struct AppState {
    db_pool: PgPool,
    redis_pool: Pool<RedisConnectionManager>,
}

fn redis_url() -> String {
    std::env::var("REDIS_URL").expect("[Config] REDIS_URL must be set.")
}

async fn extract(req: &ServiceRequest) -> Result<Vec<Role>, Error> {
    let user = match Identity::from_request(&req.request(), &mut Payload::None).into_inner() {
        Ok(user) => user,
        Err(_) => return Ok(vec![]),
    };
    let data = req.app_data::<web::Data<AppState>>().unwrap();

    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();
    Ok(vec![user.role])
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let database_url =
        String::from(std::env::var("DATABASE_URL").expect("[Config] DATABASE_URL must be set."));

    let secret_key = Key::from(
        std::env::var("SECRET_KEY")
            .expect("[Config] SECRET_KEY must be set.")
            .as_bytes(),
    );

    let redis_store = match RedisSessionStore::new(redis_url()).await {
        Ok(store) => {
            println!("[Session Store] Succeed to connect redis.");
            store
        }
        Err(err) => {
            println!("[Session Store] Failed to connect to the redis: {:?}", err);
            std::process::exit(1);
        }
    };
    let redis_pool = match Pool::builder()
        .build(
            RedisConnectionManager::new(redis_url()).expect("[Redis] Failed to build connection."),
        )
        .await
    {
        Ok(pool) => {
            println!("[Redis] Succeed to build redis pool.");
            pool
        }
        Err(err) => {
            println!("[Redis] Failed to connect to the redis: {:?}", err);
            std::process::exit(1);
        }
    };

    // Create a connection pool
    let db_pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
    {
        Ok(pool) => {
            println!("[Database] Connection to the database is successful!");
            pool
        }
        Err(err) => {
            println!("[Database] Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    spawn(compile_worker(db_pool.clone(), redis_pool.clone()));
    spawn(run_worker(db_pool.clone(), redis_pool.clone()));

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_methods(vec!["OPTIONS", "PUT", "POST", "GET", "PATCH", "DELETE"])
            .allow_any_header()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://127.0.0.1:3000")
            .allowed_origin("https://judge.xjt.lu")
            .max_age(3600)
            .supports_credentials();
        App::new()
            .wrap(GrantsMiddleware::with_extractor(extract))
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::builder(redis_store.clone(), secret_key.clone())
                    .cookie_name(String::from("SESSION_ID"))
                    .build(),
            )
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
