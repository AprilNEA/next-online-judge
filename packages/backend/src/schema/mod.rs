use serde::{Deserialize, Serialize};

pub(crate) mod problem;
pub(crate) mod user;

/// 这是一个基础的回应构建器
#[derive(Debug, Deserialize, Serialize)]
pub struct ResponseBuilder<T> {
    success: bool,
    data: Option<T>,
}

impl<T> ResponseBuilder<T> {
    pub fn success(data: T) -> Self {
        ResponseBuilder {
            success: true,
            data: Some(data),
        }
    }

    pub fn success_without_data() -> ResponseBuilder<()> {
        ResponseBuilder {
            success: true,
            data: None,
        }
    }

    pub fn failed(data: T) -> Self {
        ResponseBuilder {
            success: false,
            data: Some(data),
        }
    }
}
