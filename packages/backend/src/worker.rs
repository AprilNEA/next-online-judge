use crate::dao::{get_submission_by_id, get_testcases_by_submission_id, update_submission_status};
use crate::entity::SubmissionStatus;
use crate::error::{AppError, HandleRedisError, HandleSqlxError};
use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use redis::AsyncCommands;
use sandbox::NsJail;
use sqlx::PgPool;

pub async fn compile_worker(
    db_pool: PgPool,
    redis_pool: Pool<RedisConnectionManager>,
) -> Result<(), AppError> {
    println!("[Worker][Compile] Worker is right");
    let mut conn = redis_pool.get().await.unwrap();
    let jail = NsJail {
        chroot_path: String::from("/"),
    };
    loop {
        let task_data: Option<(String, String)> =
            conn.brpop("compile_task_queue", 0).await.unwrap();
        let mut conn = redis_pool.get().await.expect("Unable to get");

        match task_data {
            Some((_list, data)) => {
                println!("[Worker][Compile]: {}", data);
                let submission_id = data.parse::<i32>().unwrap();
                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect(&*format!(
                        "[Worker][Compile] Error: update status {}",
                        submission_id
                    ));
                let submission =
                    get_submission_by_id(&db_pool, submission_id)
                        .await
                        .expect(&*format!(
                            "[Worker][Compile] Error: no submission {}",
                            submission_id
                        ));
                jail.compile(submission_id.to_string(), submission.code)
                    .expect(&*format!(
                        "[Worker][Compile] Error: compile error {}",
                        submission_id
                    ));
                let _: () = conn
                    .lpush("run_task_queue", &submission.id)
                    .await
                    .handle_redis_err()?;
            }
            None => {}
        }
    }
}

pub async fn run_worker(
    db_pool: PgPool,
    redis_pool: Pool<RedisConnectionManager>,
) -> Result<(), AppError> {
    println!("[Worker][Run] Worker is right");
    let mut conn = redis_pool.get().await.unwrap();
    let jail = NsJail {
        chroot_path: String::from("/"),
    };

    loop {
        let task_data: Option<(String, String)> = conn.brpop("run_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                println!("[Worker][Run]: {}", data);
                let submission_id = data.parse::<i32>().unwrap();
                update_submission_status(&db_pool, submission_id, SubmissionStatus::Running)
                    .await
                    .expect("TODO: panic message");
                let testcases = get_testcases_by_submission_id(&db_pool, submission_id)
                    .await
                    .handle_sqlx_err()?;
                let mut flag = true;
                for testcase in testcases {
                    let output = jail
                        .run(submission_id.to_string(), Some(testcase.input))
                        .unwrap();
                    if output != testcase.output {
                        flag = false;
                        break;
                    }
                }
                match flag {
                    true => {
                        update_submission_status(
                            &db_pool,
                            submission_id,
                            SubmissionStatus::Accepted,
                        )
                        .await
                        .expect("TODO: panic message");
                    }
                    false => {
                        update_submission_status(
                            &db_pool,
                            submission_id,
                            SubmissionStatus::RunningError,
                        )
                        .await
                        .expect("TODO: panic message");
                    }
                }
            }
            None => {}
        }
    }
}
