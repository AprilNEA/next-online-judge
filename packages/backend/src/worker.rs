use crate::dao::{get_submission_by_id, update_submission_status};
use crate::entity::SubmissionStatus;
use bb8::Pool;
use bb8_redis::RedisConnectionManager;
use redis::AsyncCommands;
use sqlx::PgPool;

pub async fn compile_worker(db_pool: PgPool, redis_pool: Pool<RedisConnectionManager>) {
    println!("[Worker][Compile] Worker is right");
    let mut conn = redis_pool.get().await.unwrap();
    loop {
        let task_data: Option<(String, String)> =
            conn.brpop("compile_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                println!("[Worker][Compile]: {}", data);
                let submission_id = data.parse::<i32>().unwrap();
                let submission =
                    get_submission_by_id(&db_pool, submission_id)
                        .await
                        .expect(&*format!(
                            "[Worker][Compile] Error: no submission {}",
                            submission_id
                        ));
                // let username = jail
                //     .compile(submission_id.to_string(), submission.code)
                //     .expect(&*format!(
                //         "[Worker][Compile] Error: compile error {}",
                //         submission_id
                //     ));
                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect(&*format!(
                        "[Worker][Compile] Error: update status {}",
                        submission_id
                    ));
            }
            None => {}
        }
    }
}

pub async fn run_worker(db_pool: PgPool, redis_pool: Pool<RedisConnectionManager>) {
    println!("[Worker][Run] Worker is right");
    let mut conn = redis_pool.get().await.unwrap();

    loop {
        let task_data: Option<(String, String)> = conn.brpop("run_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                println!("[Worker][Run]: {}", data);
                let submission_id = data.parse::<i32>().unwrap();

                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect("TODO: panic message");
            }
            None => {}
        }
    }
}
