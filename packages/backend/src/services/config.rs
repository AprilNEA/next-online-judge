use crate::services::handler::{basic, problem, user};
use actix_web::web::{get, post, resource, scope, ServiceConfig};
use actix_web_grants::PermissionGuard;

pub fn config(cfg: &mut ServiceConfig) {
    cfg.service(
        scope("/api")
            .service(resource("/health").route(get().to(basic::health)))
            .service(
                scope("/user")
                    .service(resource("/info").route(get().to(user::info)))
                    .service(resource("/login").route(post().to(user::login)))
                    .service(resource("/register").route(post().to(user::register)))
                    .service(resource("/code").route(post().to(user::code)))
                    .service(resource("/active").route(post().to(user::active)))
                    .service(resource("/forget").route(post().to(user::forget))),
            )
            .service(
                scope("/problem")
                    .service(resource("/add").route(post().to(problem::add)))
                    .service(resource("/testcase/add").route(post().to(problem::add_testcase)))
                    .service(resource("/all").route(get().to(problem::get_all)))
                    .service(resource("/submit").route(post().to(problem::submit)))
                    .service(resource("/status").route(get().to(problem::submission_list)))
                    .service(resource("/{id}").route(get().to(problem::get))),
            )
            .service(
                scope("/admin")
                    .service(resource("/health").route(get().to(basic::health)))
                    .guard(PermissionGuard::new("ROLE_ADMIN".to_string())),
            ),
    );
}
