const JOBE_RESTAPI: &'static str = "ffffff";

pub mod jobe {
    use std::collections::HashMap;
    use crate::sandbox::JOBE_RESTAPI;

    /* 获取JOBE服务器可用的语言 */
    pub async fn get_languages() -> Result<(), reqwest::Error> {
        let body = reqwest::get(JOBE_RESTAPI.to_owned() + "/languages")
            .await?
            .text()
            .await?;

        println!("body = {:?}", body);
        Ok(())
    }

    /* 上传文件 */
    pub async fn post_file(file_contents: &str) -> Result<(), reqwest::Error> {
        let mut map = HashMap::new();
        map.insert("file_contents", file_contents);
        let client = reqwest::Client::new();

        let body = client.post(JOBE_RESTAPI.to_owned() + "/files/")
            .json(&map)
            .send()
            .await?;

        println!("body = {:?}", body);
        Ok(())
    }

    /* 更新文件 */
    pub async fn put_file(file_contents: &str) -> Result<(), reqwest::Error> {
        let mut map = HashMap::new();
        map.insert("file_contents", file_contents);
        let client = reqwest::Client::new();

        let body = client.put(JOBE_RESTAPI.to_owned() + "/files/")
            .json(&map)
            .send()
            .await?;

        println!("body = {:?}", body);
        Ok(())
    }

    /* 检查文件存在 */
    pub async fn check_file(file_id: &str) -> Result<(), reqwest::Error> {
        let client = reqwest::Client::new();
        let body = client.head(JOBE_RESTAPI.to_owned() + "/files/" + file_id);

        println!("body = {:?}", body);
        Ok(())
    }

    /* 单次提交运行代码 */
    // pub async fn submit_run() -> Result<()> {
    //     let mut map = HashMap::new();
    //     map.insert("lang", "rust");
    //     map.insert("body", "json");
    //
    //     let client = reqwest::Client::new();
    //     let res = client.post(JOBE_RESTAPI.to_owned() + "/runs")
    //         .json(&map)
    //         .send()
    //         .await?;
    // }
    /* 检查单例运行状态 */
    // pub async fn get_run_status(unique_id: &str) {
    //     let res = reqwest::get(JOBE_RESTAPI.to_owned() + "/runresults/" + unique_id)
    //         .await?;
    // }
}

mod nsjail {
    use std::io;
    use std::process::Command;

    pub fn run() -> io::Result<()> {
        // Path to the C++ source and output binary
        let source_filename = "hello.cpp";
        let output_filename = "hello";

        // Compile the C++ code
        let compile_status = Command::new("g++")
            .arg("-o")
            .arg(output_filename)
            .arg(source_filename)
            .status()?;

        if !compile_status.success() {
            return Err(io::Error::new(io::ErrorKind::Other, "Compilation failed!"));
        }

        // Execute the compiled code with nsjail
        let chroot_path = "/path/to/chroot/dir";
        let libs_path = "/path/to/libs";
        let input_file_path = "/path/to/input.txt";

        let execute_status = Command::new("nsjail")
            .arg("--rlimit_cpu=2")
            .arg("--rlimit_as=128M")
            .arg("--rlimit_fsize=10M")
            .arg(format!("--chroot={}", chroot_path))
            .arg(format!("--bindmount_ro={}", libs_path))
            .arg(format!("--bindmount_ro={}", input_file_path))
            .arg("--stderr_to_null")
            .arg("--stdout_to_null")
            .arg("--seccomp_string=read write ...")
            .arg(format!("{}/{}", chroot_path, output_filename))
            .status()?;

        if !execute_status.success() {
            return Err(io::Error::new(io::ErrorKind::Other, "Execution failed!"));
        }

        Ok(())
    }
}
