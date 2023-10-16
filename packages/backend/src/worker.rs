use crate::dao::{get_submission_by_id, update_submission_status};
use crate::entity::SubmissionStatus;
use redis::AsyncCommands;
use sqlx::PgPool;

async fn compile_worker(db_pool: PgPool) {
    println!("Compile worker is right");
    let client = redis::Client::open("redis://localhost:6388/").unwrap();
    let mut conn = client.get_async_connection().await.unwrap();

    loop {
        let task_data: Option<(String, String)> =
            conn.brpop("compile_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                let submission_id = data.parse::<i32>().unwrap();

                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect("TODO: panic message");
            }
            None => {}
        }
    }
}

async fn running_worker(db_pool: PgPool) {
    println!("Running worker is right");
    let client = redis::Client::open("redis://localhost:6388/").unwrap();
    let mut conn = client.get_async_connection().await.unwrap();
    loop {
        let task_data: Option<(String, String)> =
            conn.brpop("running_task_queue", 0).await.unwrap();
        match task_data {
            Some((_list, data)) => {
                let submission_id = data.parse::<i32>().unwrap();
                let submission = get_submission_by_id(&db_pool, submission_id);

                update_submission_status(&db_pool, submission_id, SubmissionStatus::Compiling)
                    .await
                    .expect("TODO: panic message");
            }
            None => {}
        }
    }
}
