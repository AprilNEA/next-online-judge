use actix_web::{HttpResponse, Responder};
use serde_json::json;

pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({"status": "success"}))
}
