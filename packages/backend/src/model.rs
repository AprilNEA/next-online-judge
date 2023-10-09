use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Role {
    USER,
    ADMIN,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum AnswerStatus {
    // Pending/Waiting
    PW,
    // Compiling
    CO,
    // Running/Judging
    RU,
    // Accepted
    AC,
    // CompileError
    CE,
    // WrongAnswer
    WA,
    // TimeLimitExceeded
    TLE,
    // RunningError
    RE,
    // MemoryLimitExceeded
    MLE,
    /* PresentationError */
    PE,
    // OutputLimitExceeded
    OLE,
    // UnknownError
    UE,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum Language {
    C,
    GO,
    CPP,
    RUST,
    PYTHON,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub handle: Option<String>,
    pub password: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserAuthModel {
    pub id: i32,
    pub role: String,
    // fixme
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
#[allow(non_snake_case)]
struct QuestionModel {
    id: i32,
    title: String,
    description: Option<String>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
#[allow(non_snake_case)]
struct AnswerModel {
    id: i32,
    code: String,
    status: AnswerStatus,
    user_id: i32,
    language: Language,
    created_at: DateTime<Utc>,
}