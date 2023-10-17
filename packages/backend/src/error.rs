use actix_web::{
    error::ResponseError,
    http::{header::ContentType, StatusCode},
    HttpResponse,
};
use derive_more::{Display, Error};
use std::fmt::{Debug, Display, Formatter};

#[derive(serde::Serialize)]
struct ErrorResponse {
    message: String,
}

#[derive(Debug, Display, Error)]
pub enum AppError {
    #[display(fmt = "Problem not found in database")]
    ProblemNotFound,
    #[display(fmt = "Database Error")]
    DatabaseError,
    #[display(fmt = "Unknown Error")]
    UnknownError,
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match *self {
            AppError::ProblemNotFound => StatusCode::NOT_FOUND,
            AppError::DatabaseError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::UnknownError => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .json(ErrorResponse {
                message: self.to_string(),
            })
    }
}
