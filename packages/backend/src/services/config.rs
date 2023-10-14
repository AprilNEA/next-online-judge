use actix_web::web::{ServiceConfig, scope, resource, post, get};
use crate::services::handler::{
    basic,
    user,
    problem,
};

pub fn config(cfg: &mut ServiceConfig) {
    cfg
        .service(
            scope("/api")
                .service(resource("/health").route(get().to(basic::health)))
                .service(scope("/user")
                    .service(resource("/login").route(post().to(user::login)))
                    .service(resource("/register").route(post().to(user::register)))
                )
                .service(scope("/problem")
                    .service(resource("/all").route(get().to(problem::get_all)))
                    .service(resource("/submit").route(post().to(problem::submit)))
                    .service(resource("/status").route(get().to(problem::submission_list)))
                    .service(resource("/{id}").route(get().to(problem::get)))
                )
        );
}