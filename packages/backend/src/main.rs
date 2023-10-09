mod sandbox;
mod handler;


use actix_cors::Cors;
use actix_web::{http::header, web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use sqlx::postgres::{PgPool, PgPoolOptions};

pub struct AppState {
    db: PgPool,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // This line loads the environment variables from the ".env" file.
    dotenv().ok();

    let database_url = String::from(std::env::var("DATABASE_URL").expect("DATABASE_URL must be set."));

    // Create a connection pool
    let pool = match PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url).await
    {
        Ok(pool) => {
            println!("✅Connection to the database is successful!");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handler::config)
            .wrap(cors)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
