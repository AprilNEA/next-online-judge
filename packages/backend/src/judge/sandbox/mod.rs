pub mod nsjail;
#[allow(dead_code)]
pub mod jobe;

use crate::judge::JudgeError;

pub trait Sandbox {
    fn compile(&self, input_code: String) -> Result<String, JudgeError>;
    fn run(&self, filename: String, input: Option<&str>) -> Result<String, JudgeError>;
}