use crate::{
    entity::{
        problem::{ProblemModel, SubmissionForList, SubmissionModel, TestcaseModel},
        SubmissionStatus,
    },
    schema::ProblemCreateSchema,
    AppState,
};
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path, Query};
use actix_web::{App, HttpResponse, Responder, ResponseError};

use crate::dao::{get_problem_by_id, get_user_by_id};
use crate::entity::{Paged, PagedResult, Paginator};
use crate::error::AppError;
use crate::schema::{ProblemCreateResponseSchema, SubmitCodeSchema, TestCaseCreateSchema};
use crate::utils::parse_user_id;
use redis::AsyncCommands;

pub async fn get_all(query: Query<Paginator>, data: Data<AppState>) -> impl Responder {
    match ProblemModel::paged(&data.db_pool, &query.into_inner()).await {
        Ok(paged_result) => HttpResponse::Ok().json(paged_result),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

pub async fn get(id: Path<i32>, data: Data<AppState>) -> impl Responder {
    match get_problem_by_id(&data.db_pool, id.into_inner()).await {
        Ok(problems) => HttpResponse::Ok().json(problems.id),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

pub async fn add(
    user: Identity,
    body: Json<ProblemCreateSchema>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();

    // TODO transcation manully
    // let tx = data.db_pool.clone();
    //
    // sqlx::query("BEGIN")
    //     .execute(tx)
    //     .await
    //     .expect("BEGIN failed");

    let new_problem_id = sqlx::query!(
        r#"
        INSERT INTO public.problem (title, description, created_user_id)
        VALUES ($1, $2, $3)
        RETURNING id
        "#,
        &body.title,
        &body.description,
        &user.id
    )
    .fetch_one(&data.db_pool)
    .await
    .map_err(|_e| AppError::DatabaseError)?;

    for testcase in &body.testcases {
        sqlx::query::<_>(
            r#"
            INSERT INTO testcase (problem_id, is_hidden, input, output, created_user_id)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(&new_problem_id.id)
        .bind(&testcase.is_hidden)
        .bind(&testcase.input)
        .bind(&testcase.output)
        .bind(&user.id)
        .execute(&data.db_pool)
        .await
        .map_err(|_e| AppError::DatabaseError)?;
    }

    // tx.commit().await.map_err(|_e| AppError::DatabaseError)?;

    Ok(HttpResponse::Ok().json(ProblemCreateResponseSchema {
        new_problem_id: new_problem_id.id,
    }))
}

pub async fn add_testcase(
    user: Identity,
    body: Json<Vec<TestCaseCreateSchema>>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> 
{
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();
    
    let problem = get_problem_by_id(&data.db_pool, body.0[0].problem_id)
        .await
        .unwrap();

    let mut TestcaseVec: Vec<TestcaseModel> = Vec::new();
    
    for testcaseTemp in &body.0
    {
        let testcase = sqlx::query_as::<_, TestcaseModel>(
            r#"
                INSERT INTO public.testcase (problem_id, is_hidden, input, output, created_user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, problem_id, is_hidden, input, output
                "#,
        )
        .bind(&testcaseTemp.problem_id)
        .bind(&testcaseTemp.is_hidden)
        .bind(&testcaseTemp.input)
        .bind(&testcaseTemp.output)
        .bind(&user.id)
        .fetch_one(&data.db_pool)
        .await
        .map_err(|_e| AppError::DatabaseError)?;
        TestcaseVec.push(testcase);
    }

    Ok(HttpResponse::Ok().json(TestcaseVec))
}

pub async fn submit(
    user: Identity,
    body: Json<SubmitCodeSchema>,
    data: Data<AppState>,
) -> impl Responder {
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();
    let problem = get_problem_by_id(&data.db_pool, body.problem_id)
        .await
        .unwrap();

    let submission = match sqlx::query_as::<_, SubmissionModel>(
        r#"#
        INSERT INTO public.submission (code, status, user_id, problem_id, language)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(&body.source_code)
    .bind(SubmissionStatus::Pending)
    .bind(&user.id)
    .bind(&problem.id)
    .bind(&body.language)
    .fetch_one(&data.db_pool)
    .await
    {
        Ok(r) => r,
        Err(e) => {
            return HttpResponse::InternalServerError().json(format!("Database error: {}", e))
        }
    };

    {
        let mut conn = data.redis_pool.get().await.unwrap();
        let _: () = conn
            .lpush("compile_task_queue", &submission.id)
            .await
            .unwrap();
    }

    HttpResponse::Ok().json(&submission.id)
}

pub async fn submission_list(
    query: Query<Paginator>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let paginator = query.into_inner();
    let total: i64 = sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM public.submission"#)
        .fetch_one(&data.db_pool)
        .await
        .map_err(|_e| AppError::DatabaseError)?;

    let total_pages = (total + paginator.size - 1) / paginator.size;

    let submissions = sqlx::query_as::<_, SubmissionForList>(
        r#"
        SELECT
            s.id,
            s.status,
            s.user_id,
            u.handle AS "user_handle",
            s.problem_id,
            p.title AS "problem_title",
            s.language,
            s.created_at
        FROM
            public.submission s
        INNER JOIN
            public.user u ON s.user_id = u.id
        INNER JOIN
            public.problem p ON s.problem_id = p.id
        ORDER BY s.id DESC
        "#,
    )
    .fetch_all(&data.db_pool)
    .await
    .map_err(|_e| AppError::DatabaseError)?;

    Ok(HttpResponse::Ok().json(PagedResult {
        data: submissions,
        total,
        size: paginator.size,
        total_pages,
        current_page: paginator.page,
        has_perv_page: paginator.page > 1,
        has_next_page: paginator.page < total_pages,
    }))
}
