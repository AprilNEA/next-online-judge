use serde_json::json;
use actix_web::{HttpResponse, Responder};

pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({"status": "success"}))
}
