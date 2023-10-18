use actix_web::{
    error::ResponseError,
    http::{header::ContentType, StatusCode},
    HttpResponse,
};
use derive_more::{Display, Error};
use redis::RedisError;
use sqlx::Error as SqlxError;
use std::fmt::Debug;

pub trait HandleSqlxError<T> {
    fn handle_sqlx_err(self) -> Result<T, AppError>;
}

impl<T> HandleSqlxError<T> for Result<T, SqlxError> {
    fn handle_sqlx_err(self) -> Result<T, AppError> {
        self.map_err(|e| match e {
            SqlxError::RowNotFound => AppError::NotFound,
            SqlxError::Database(db_err) => {
                if db_err.is_foreign_key_violation() {
                    AppError::DuplicateError
                } else {
                    match db_err.code() {
                        _ => AppError::DatabaseError,
                    }
                }
            }
            _ => AppError::DatabaseError,
        })
    }
}

pub trait HandleRedisError<T> {
    fn handle_redis_err(self) -> Result<T, AppError>;
}

impl<T> HandleRedisError<T> for Result<T, RedisError> {
    fn handle_redis_err(self) -> Result<T, AppError> {
        self.map_err(|_e| AppError::RedisError)
    }
}

#[derive(serde::Serialize)]
struct ErrorResponse {
    success: bool,
    message: String,
}

#[derive(Debug, Display, Error)]
pub enum AppError {
    #[display(fmt = "NotFound")]
    NotFound,
    #[display(fmt = "DuplicateError")]
    DuplicateError,
    #[display(fmt = "ValidateError")]
    ValidateError,
    #[display(fmt = "Password input error")]
    PasswordError,
    #[display(fmt = "crypt error")]
    CryptError,
    #[display(fmt = "session error")]
    SessionError,
    #[display(fmt = "SMSRequestError")]
    SMSRequestError,
    #[display(fmt = "Problem not found in database")]
    ProblemNotFound,
    #[display(fmt = "Database Error")]
    DatabaseError,
    #[display(fmt = "Redis Error")]
    RedisError,
    #[display(fmt = "Unknown Error")]
    UnknownError,
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match *self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::DuplicateError => StatusCode::BAD_REQUEST,
            AppError::ValidateError => StatusCode::BAD_REQUEST,
            AppError::PasswordError => StatusCode::BAD_REQUEST,
            AppError::CryptError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::SessionError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::SMSRequestError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ProblemNotFound => StatusCode::NOT_FOUND,
            AppError::RedisError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::DatabaseError => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::UnknownError => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .json(ErrorResponse {
                success: false,
                message: self.to_string(),
            })
    }
}
