use crate::entity::Language;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct Pager {
    pub page: Option<i32>,
    pub size: Option<i32>,
}

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
