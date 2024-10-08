use crate::entity::{Language, SubmissionStatus};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
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
pub struct SubmissionModel {
    pub id: i32,
    pub code: String,
    pub status: SubmissionStatus,
    pub user_id: i32,
    pub problem_id: i32,
    pub language: Language,
    pub created_at: NaiveDateTime,
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
