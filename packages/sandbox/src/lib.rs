#![allow(dead_code)]
use std::io::{self, Write};
use std::process::{Command, Stdio};

#[derive(Debug)]
pub enum JudgeError {
    FileNotFound,
    CompileError,
    RunningError,
    UnexpectedError(String),
}

pub struct NsJail {
    pub chroot_path: String,
}

impl NsJail {
    pub fn compile(&self, unique_id: String, input_code: String) -> Result<String, JudgeError> {
        let output_path = format!("{}/{}", self.chroot_path, unique_id);

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
        Ok(unique_id)
    }

    pub fn run<S: Into<String>>(
        &self,
        unique_id: String,
        input: Option<S>,
    ) -> Result<String, JudgeError> {
        let output_path = format!("{}/{}", self.chroot_path, unique_id);

        let mut child = Command::new("sudo")
            .arg("-u")
            .arg("nsjail")
            .arg("nsjail")
            .arg("-Me")
            .arg("--quiet")
            .arg("--disable_proc")
            .arg("--chroot=/")
            .arg("--rlimit_cpu=1")
            .arg("--rlimit_as=128")
            .arg("--rlimit_fsize=10")
            // .arg("--user 99999")
            // .arg("--group 99999")
            // .arg("--seccomp_string=read write open openat close newstat newfstat"
            .arg("--")
            .arg(format!("{}", output_path))
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();

        {
            let stdin = child.stdin.as_mut().unwrap();
            if let Some(input) = input {
                stdin.write_all(input.into().as_bytes()).unwrap();
            }
        }

        let output = child.wait_with_output().unwrap();

        if !output.status.success() {
            return Err(JudgeError::RunningError);
        }

        let result = String::from_utf8(output.stdout)
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
            .unwrap();

        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use crate::NsJail;

    #[test]
    fn test_hello() {
        let test_name = String::from("test_hello");
        let nsjail = NsJail {
            chroot_path: "/root/next-online-judge/tmp".parse().unwrap(),
        };
        let name = nsjail.compile(
            test_name.clone(),
            String::from(
                r#"
                #include <iostream>
                int main(){
                    std::cout << "Hello, World!" << std::endl;
                    return 0;
                }"#,
            ),
        );
        assert_eq!(name.unwrap(), test_name.clone());
        let result = nsjail.run(test_name.clone(), None);
        assert_eq!(result.unwrap().to_string(), "Hello, World!\n");
    }

    #[test]
    fn test_add() {
        let test_name = String::from("test_add");
        let nsjail = NsJail {
            chroot_path: "/root/next-online-judge/tmp".parse().unwrap(),
        };
        let code = String::from(
            r#"
        #include <iostream>
        int main() {
            int a, b;
            std::cin >> a >> b;
            std::cout << (a + b) << std::endl;
            return 0;
        }
        "#,
        );
        let name = nsjail.compile(test_name.clone(), code);
        assert_eq!(name.unwrap(), test_name.clone());
        let result = nsjail.run(test_name.clone(), Some("5\n3\n"));
        assert_eq!(result.unwrap().to_string(), "8\n");
    }
}
