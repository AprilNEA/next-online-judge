pub(crate) mod user;

use crate::entity::Language;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct LoginSchema {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterSchema {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CodeRequestSchema {
    pub account: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct ValidateCodeSchema<T> {
    pub to: String,
    pub signature: String,
    pub template_id: String,
    pub template_data: T,
}

/* 您的验证码是{code}，{ttl}分钟内有效。 */
#[derive(Serialize, Deserialize, Debug)]
pub struct SMSTempVerifyTTL2 {
    pub code: u32,
    pub ttl: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateNoteSchema {
    pub title: Option<String>,
    pub content: Option<String>,
    pub category: Option<String>,
    pub published: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SubmitCodeSchema {
    pub problem_id: i32,
    pub language: Language,
    pub source_code: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TestCaseCreateSchema {
    pub problem_id: i32,
    pub is_hidden: bool,
    pub input: String,
    pub output: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ProblemCreateSchema {
    pub title: String,
    pub description: String,
    pub testcases: Option<Vec<TestCaseCreateSchema>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct ProblemCreateResponseSchema {
    pub new_problem_id: i32,
}
