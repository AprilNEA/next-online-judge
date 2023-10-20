use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

use crate::entity::Role;

#[derive(Debug, Deserialize, Serialize)]
pub struct UserSession {
    pub id: i32,
    pub role: Role,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserModel {
    pub id: i32,
    pub role: Role,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub handle: Option<String>,
    pub password: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserAuthModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub handle: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserPublicModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub handle: String,
}
