pub mod sandbox;

#[derive(Debug)]
pub enum JudgeError {
    FileNotFound,
    CompileError,
    RunningError,
    UnexpectedError(String),
}

