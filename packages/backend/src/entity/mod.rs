pub mod problem;
pub mod user;

use serde::{Deserialize, Serialize};

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
    Go,
    Cpp,
    Rust,
    Python,
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
