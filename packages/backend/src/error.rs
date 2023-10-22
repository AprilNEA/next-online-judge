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
                        _ => AppError::DatabaseError {
                            message: db_err.to_string(),
                        },
                    }
                }
            }
            _ => AppError::UnknownError,
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
    code: i32,
    message: String,
}

#[derive(Debug, Display, Error)]
pub enum AppError {
    #[display(fmt = "query not found")]
    NotFound,
    #[display(fmt = "problem not found in database")]
    ProblemNotFound,
    #[display(fmt = "already exist")]
    DuplicateError,
    #[display(fmt = "data validate wrong")]
    ValidateError,
    #[display(fmt = "password input wrong")]
    PasswordError,
    #[display(fmt = "server crypt error")]
    CryptError,
    #[display(fmt = "server session error")]
    SessionError,
    #[display(fmt = "sms request error")]
    SMSRequestError,
    #[display(fmt = "database Error: {}", message)]
    DatabaseError { message: String },
    #[display(fmt = "redis Error")]
    RedisError,
    #[display(fmt = "unknown Error")]
    UnknownError,
}

fn status_code(err: &AppError) -> i32 {
    match *err {
        AppError::NotFound => 40400,
        AppError::ProblemNotFound => 40401,

        AppError::DuplicateError => 40601,
        AppError::ValidateError => 40602,
        AppError::PasswordError => 40603,

        AppError::UnknownError => 50000,
        AppError::RedisError => 50002,
        AppError::DatabaseError { .. } => 50003,
        AppError::CryptError => 50004,
        AppError::SessionError => 50005,
        AppError::SMSRequestError => 50006,
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(StatusCode::OK)
            .insert_header(ContentType::json())
            .json(ErrorResponse {
                success: false,
                code: status_code(&self),
                message: self.to_string(),
            })
    }
}
