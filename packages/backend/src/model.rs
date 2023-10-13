use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

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
#[sqlx(type_name = "answer_status")]
enum AnswerStatus {
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
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct UserAuthModel {
    pub id: i32,
    pub role: Role,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, sqlx::FromRow)]
pub struct ProblemModel {
    id: i32,
    title: String,
    description: Option<String>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
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
struct SolutionModel {
    id: i32,
    code: String,
    status: AnswerStatus,
    user_id: i32,
    language: Language,
    created_at: DateTime<Utc>,
}