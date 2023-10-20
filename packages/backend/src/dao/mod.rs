/// Here is the database helper to access data
use crate::entity::{
    problem::{ProblemModel, SubmissionModel},
    user::UserPublicModel,
    SubmissionStatus,
};
use sqlx::{Error, PgPool};

pub async fn get_user_by_id(db_pool: &PgPool, user_id: i32) -> Result<UserPublicModel, Error> {
    sqlx::query_as::<_, UserPublicModel>(
        r#"
        SELECT id, role, email, handle FROM public.user WHERE id = $1
        "#,
    )
    .bind(user_id)
    .fetch_one(db_pool)
    .await
}

pub async fn get_problem_by_id(db_pool: &PgPool, id: i32) -> Result<ProblemModel, Error> {
    sqlx::query_as::<_, ProblemModel>(
        r#"
        SELECT * FROM public.problem WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_one(db_pool)
    .await
}

pub async fn get_submission_by_id(db_pool: &PgPool, id: i32) -> Result<SubmissionModel, Error> {
    sqlx::query_as::<_, SubmissionModel>(
        r#"
        SELECT * FROM public.submission WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_one(db_pool)
    .await
}

pub async fn update_submission_status(
    db_pool: &PgPool,
    submission_id: i32,
    new_status: SubmissionStatus,
) -> Result<SubmissionModel, Error> {
    sqlx::query_as::<_, SubmissionModel>(
        r#"
        UPDATE public.submission SET status = $1 WHERE id = $2 RETURNING *
        "#,
    )
    .bind(new_status)
    .bind(submission_id)
    .fetch_one(db_pool)
    .await
}
