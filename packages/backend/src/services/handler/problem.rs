use std::fmt::Debug;
use actix_web::{HttpResponse, Responder};
use actix_web::web::{Json, Data, Path};
use actix_identity::Identity;
use crate::{
    judge::sandbox::nsjail::NsJail,
    model::{ProblemModel},
    schema::{SubmitCodeSchema},
    AppState,
};
use crate::judge::sandbox::Sandbox;


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
        Err(e) => {
            HttpResponse::InternalServerError().json(format!("Database error: {}", e))
        }
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
    let r = nsjail.compile(body.source_code.to_owned()).expect("TODO: panic message");
    let d = nsjail.run(r,None).expect("No");
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

// pub async fn check_status(){
//
// }