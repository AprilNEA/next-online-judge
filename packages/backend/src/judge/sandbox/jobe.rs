use serde::{Deserialize, Serialize};

pub struct JOBE {
    base: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct CodePayload {
    language_id: String,
    sourcecode: String,
    input: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct CodeResultPayload {
    stdout: String,
    stderr: String,
}

#[allow(dead_code)]
impl JOBE {
    pub fn new(base: String) -> JOBE {
        JOBE { base }
    }

    /* 获取 JOBE 服务器可用的语言 */
    #[allow(dead_code)]
    pub async fn get_languages(&self) -> Result<(), reqwest::Error> {
        let body = reqwest::get(self.base.to_owned() + "/languages")
            .await?
            .text()
            .await?;

        println!("body = {:?}", body);
        Ok(())
    }

    /* 单次提交运行代码 */
    #[allow(dead_code)]
    pub async fn submit_run(&self, sourcecode: String, input: Option<String>) {
        let payload = CodePayload {
            language_id: "cpp".parse().unwrap(),
            sourcecode,
            input,
        };

        let client = reqwest::Client::new();
        let res = client
            .post(self.base.to_owned() + "/runs")
            .json(&payload)
            .send()
            .await;
        // .json()
        // .await?;
    }
}
