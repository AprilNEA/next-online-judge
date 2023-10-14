use serde::{Deserialize, Serialize};
use chrono::{NaiveDateTime};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "role", rename_all = "UPPERCASE")]
pub enum Role {
    User,
    Admin,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "language", rename_all = "UPPERCASE")]
pub enum Language {
    C,
    GO,
    CPP,
    RUST,
    PYTHON,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "submission_status")]
pub enum SubmissionStatus {
    Pending,
    Compiling,
    Running,
    Accepted,
    CompileError,
    WrongAnswer,
    TimeLimitExceeded,
    RunningError,
    MemoryLimitExceeded,
    PresentationError,
    OutputLimitExceeded,
    UnknownError,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub handle: Option<String>,
    pub password: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserAuthModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct ProblemModel {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
struct TestCase {
    id: i32,
    problem_id: i32,
    is_hidden: bool,
    input: String,
    output: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
#[serde(rename_all(serialize = "camelCase"))]
struct SubmissionModel {
    id: i32,
    code: String,
    status: SubmissionStatus,
    user_id: i32,
    problem_id: i32,
    language: Language,
    created_at: NaiveDateTime,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct SubmissionForList {
    pub id: i32,
    pub status: SubmissionStatus,
    pub user_id: i32,
    pub user_handle: String,
    pub problem_id: i32,
    pub problem_title: String,
    pub language: Language,
    pub created_at: NaiveDateTime,
}