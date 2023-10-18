use serde::{Deserialize, Serialize};
use crate::entity::Role;
use crate::entity::user::UserPublicModel;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "UPPERCASE"))]
pub enum UserStatus {
    Block,
    Normal,
    InActive,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct InfoResponse {
    pub id: i32,
    pub role: Role,
    pub handle: Option<String>,
    pub status: UserStatus
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SMSResponse {
    pub code: String,
    pub message: String,
    pub data: SMSResponseData,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "camelCase"))]
pub struct SMSResponseData {
    pub recipients: i32,
    pub message_count: i32,
    pub total_amount: String,
    // 使用String表示金额，可以根据需要使用更精确的数据类型
    pub pay_amount: String,
    pub virtual_amount: String,
    pub messages: Vec<SMSMessageReport>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all(deserialize = "camelCase"))]
pub struct SMSMessageReport {
    pub id: String,
    pub to: String,
    pub region_code: String,
    pub country_code: String,
    pub message_count: i32,
    pub status: String,
    pub upstream: String,
    pub price: String,
}
