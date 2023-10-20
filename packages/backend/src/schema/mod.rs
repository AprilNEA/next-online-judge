use serde::{Deserialize, Serialize};

pub(crate) mod problem;
pub(crate) mod user;

/// 这是一个基础的回应构建器
#[derive(Debug, Deserialize, Serialize)]
pub struct ResponseBuilder {
    success: bool,
}

impl ResponseBuilder {
    pub fn success() -> Self {
        ResponseBuilder { success: true }
    }
}
