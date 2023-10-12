use actix_web::web::{ServiceConfig, scope, resource, post, get};
use crate::services::handler::{
    basic::{health},
    user::{login, register},
};

pub fn config(cfg: &mut ServiceConfig) {
    cfg
        .service(
            scope("/api")
                .service(resource("/health").route(get().to(health)))
                .service(scope("/user")
                    .service(resource("/login").route(post().to(login)))
                    .service(resource("/register").route(post().to(register)))
                )
        );
}