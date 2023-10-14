use crate::judge::sandbox::Sandbox;
use crate::model::SubmissionForList;
use crate::{
    judge::sandbox::nsjail::NsJail, model::ProblemModel, schema::SubmitCodeSchema, AppState,
};
use actix_identity::Identity;
use actix_web::web::{Data, Json, Path};
use actix_web::{HttpResponse, Responder};

pub async fn get_all(
    // query: Query<Pager>,
    data: Data<AppState>,
) -> impl Responder {
    let problems = sqlx::query_as::<_, ProblemModel>(
        r#"
        SELECT * FROM public.problem
        ORDER BY id
        "#,
    )
    .fetch_all(&data.db_pool)
    .await;

    match problems {
        Ok(problems_list) => HttpResponse::Ok().json(problems_list),
        Err(e) => HttpResponse::InternalServerError().json(format!("Database error: {}", e)),
    }
}

pub async fn get(id: Path<i32>, data: Data<AppState>) -> impl Responder {
    let problem = sqlx::query_as::<_, ProblemModel>(
        r#"
        SELECT * FROM public.problem WHERE id = $1
        "#,
    )
    .bind(id.into_inner())
    .fetch_one(&data.db_pool)
    .await;

    match problem {
        Ok(problems) => HttpResponse::Ok().json(problems.id),
        Err(e) => {
            // 这里可以记录日志或进一步处理错误
            HttpResponse::InternalServerError().json(format!("Database error: {}", e))
        }
    }
}

// pub async fn add() {}

pub async fn submit(user: Identity, body: Json<SubmitCodeSchema>) -> impl Responder {
    let nsjail = NsJail;
    let r = nsjail
        .compile(body.source_code.to_owned())
        .expect("TODO: panic message");
    let d = nsjail.run(r, None).expect("No");
    HttpResponse::Ok().json(d)
    // let problem = sqlx::query_as::<_, ProblemModel>(
    //     r#"
    //     SELECT id, role, email, password FROM public.problem WHERE id = $1
    //     "#,
    // )
    //     .bind(id.into_inner())
    //     .fetch_one(&data.db_pool)
    //     .await;
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
