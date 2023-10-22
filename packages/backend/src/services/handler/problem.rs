use crate::error::{HandleRedisError, HandleSqlxError};

use crate::{
    dao::{get_problem_by_id, get_user_by_id},
    entity::{
        problem::{ProblemModel, SubmissionForList, SubmissionModel, TestcaseModel},
        SubmissionStatus,
    },
    entity::{Paged, PagedResult, Paginator},
    error::AppError,
    schema::problem::{
        ProblemCreateResponseSchema, ProblemCreateSchema, SubmitCodeSchema, TestCaseCreateSchema,
    },
    utils::parse_user_id,
    AppState,
};
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path, Query};
use actix_web::{HttpResponse, Responder};
use redis::AsyncCommands;

/// 获取所有问题
/// 带有分页器
pub async fn get_all(query: Query<Paginator>, data: Data<AppState>) -> impl Responder {
    match ProblemModel::paged(&data.db_pool, &query.into_inner()).await {
        Ok(paged_result) => HttpResponse::Ok().json(paged_result),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

// 获取问题
pub async fn get(id: Path<i32>, data: Data<AppState>) -> Result<HttpResponse, AppError> {
    Ok(HttpResponse::Ok().json(
        get_problem_by_id(&data.db_pool, id.into_inner())
            .await
            .handle_sqlx_err()?,
    ))
}

/// 添加新问题
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
    .handle_sqlx_err()?;

    if let Some(testcases) = &body.testcases {
        for testcase in testcases {
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
            .handle_sqlx_err()?;
        }
    }

    // tx.commit().await.handle_sqlx_err()?;

    Ok(HttpResponse::Ok().json(ProblemCreateResponseSchema {
        new_problem_id: new_problem_id.id,
    }))
}

pub async fn add_testcase(
    user: Identity,
    body: Json<Vec<TestCaseCreateSchema>>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .unwrap();

    get_problem_by_id(&data.db_pool, body.0[0].problem_id)
        .await
        .map_err(|_e| AppError::ProblemNotFound)?;

    let mut new_testcases: Vec<TestcaseModel> = Vec::new();

    for testcase in &body.0 {
        let new_testcase = sqlx::query_as::<_, TestcaseModel>(
            r#"
                INSERT INTO public.testcase (problem_id, is_hidden, input, output, created_user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, problem_id, is_hidden, input, output
                "#,
        )
        .bind(&testcase.problem_id)
        .bind(&testcase.is_hidden)
        .bind(&testcase.input)
        .bind(&testcase.output)
        .bind(&user.id)
        .fetch_one(&data.db_pool)
        .await
        .handle_sqlx_err()?;
        new_testcases.push(new_testcase);
    }

    Ok(HttpResponse::Ok().json(new_testcases))
}

/// 用户提交代码，返回提交的任务信息
pub async fn submit(
    user: Identity,
    body: Json<SubmitCodeSchema>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let user = get_user_by_id(&data.db_pool, parse_user_id(user))
        .await
        .handle_sqlx_err()?;
    let problem = get_problem_by_id(&data.db_pool, body.problem_id)
        .await
        .handle_sqlx_err()?;

    let submission = sqlx::query_as::<_, SubmissionModel>(
        r#"
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
    .handle_sqlx_err()?;

    let mut conn = data.redis_pool.get().await.expect("Unable to get");
    let _: () = conn
        .lpush("compile_task_queue", &submission.id)
        .await
        .handle_redis_err()?;

    Ok(HttpResponse::Ok().json(submission))
}

/// 获取任务列表
/// 带有分页器
pub async fn submission_list(
    query: Query<Paginator>,
    data: Data<AppState>,
) -> Result<HttpResponse, AppError> {
    let paginator = query.into_inner();
    let total: i64 = sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM public.submission"#)
        .fetch_one(&data.db_pool)
        .await
        .handle_sqlx_err()?;

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
    .handle_sqlx_err()?;

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
