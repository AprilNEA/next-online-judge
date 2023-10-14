use crate::judge::{sandbox::Sandbox, JudgeError};
use std::io::{self, Write};
use std::process::{Command, Stdio};
use uuid::Uuid;

pub struct NsJail;

const CHROOT_PATH: &str = "/tmp/online-judge";

impl Sandbox for NsJail {
    fn compile(&self, input_code: String) -> Result<String, JudgeError> {
        let output_filename = Uuid::new_v4().to_string();
        let output_path = format!("{}/{}", CHROOT_PATH, output_filename);

        let mut child = Command::new("g++")
            .arg("-x") // Interpret next arg as source file type
            .arg("c++") // The source file type is C++
            .arg("-o")
            .arg(&output_path)
            .arg("-") // Read from stdin
            .stdin(Stdio::piped())
            .spawn()
            .unwrap();

        {
            let stdin = child.stdin.as_mut().unwrap();
            stdin.write_all(input_code.as_bytes()).unwrap();
        }

        // Compile the C++ code
        let compile_status = child.wait().unwrap();
        if !compile_status.success() {
            return Err(JudgeError::CompileError);
        }
        Ok(output_filename)
    }

    fn run(&self, filename: String, input: Option<&str>) -> Result<String, JudgeError> {
        let output_path = format!("{}/{}", CHROOT_PATH, filename);
        let mut child = Command::new("nsjail")
            .arg("-Me")
            .arg("--rlimit_cpu=2")
            .arg("--rlimit_as=128")
            .arg("--rlimit_fsize=10")
            .arg("--user 99999")
            .arg("--group 99999")
            .arg(format!("--chroot={}", CHROOT_PATH))
            // .arg(format!("--bindmount_ro={}", libs_path))
            // .arg("--seccomp_string=read write open openat close newstat newfstat")
            .arg(&output_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();

        {
            let stdin = child.stdin.as_mut().unwrap();
            if let Some(input) = input {
                stdin.write_all(input.as_bytes()).unwrap();
            }
        }

        let output = child.wait_with_output().unwrap();

        if !output.status.success() {
            return Err(JudgeError::RunningError);
        }

        // Convert the captured output to a String
        let result = String::from_utf8(output.stdout)
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
            .unwrap();

        Ok(result)
    }
}
