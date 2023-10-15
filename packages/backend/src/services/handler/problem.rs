use crate::{
    entity::{
        problem::{ProblemModel, SubmissionForList, SubmissionModel},
        SubmissionStatus,
    },
    schema::SubmitCodeSchema,
    AppState,
};
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path, Query};
use actix_web::{HttpResponse, Responder};

use crate::dao::{get_problem_by_id, get_user_by_id};
use crate::entity::{Paged, PagedResult, Paginator};
use crate::utils::parse_user_id;
use redis::AsyncCommands;

pub async fn get_all(query: Query<Paginator>, data: Data<AppState>) -> impl Responder {
    let total: i64 = sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM public.problem"#)
        .fetch_one(&data.db_pool)
        .await
        .unwrap();

    // let problems = sqlx::query_as::<_, ProblemModel>(
    //     r#"
    //     SELECT * FROM public.problem
    //     ORDER BY id
    //     "#,
    // )
    // .fetch_all(&data.db_pool)
    // .await
    // .unwrap();

    // let paged_result = PagedResult::<ProblemModel> {
    //     data: problems,
    //     total,
    //     size: 0,
    //     total_page: 0,
    //     current_page: 0,
    //     has_perv_page: false,
    //     has_next_page: false,
    // };

    // HttpResponse::Ok().json(paged_result)
    match ProblemModel::paged(&data.db_pool, &query.into_inner()).await {
        Ok(paged_result) => HttpResponse::Ok().json(paged_result),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

pub async fn get(id: Path<i32>, data: Data<AppState>) -> impl Responder {
    match get_problem_by_id(&data.db_pool, id.into_inner()).await {
        Ok(problems) => HttpResponse::Ok().json(problems.id),
        Err(e) => {
            // 这里可以记录日志或进一步处理错误
            HttpResponse::InternalServerError().json(format!("Database error: {}", e))
        }
    }
}

// pub async fn add() {}

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

pub async fn submission_list(data: Data<AppState>) -> impl Responder {
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
    .await;

    match submissions {
        Ok(submissions) => HttpResponse::Ok().json(submissions),
        Err(e) => {
            // 这里可以记录日志或进一步处理错误
            HttpResponse::InternalServerError().json(format!("Database error: {}", e))
        }
    }
}
