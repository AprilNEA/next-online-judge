use actix_identity::{Identity};
use actix_web::{Error, FromRequest, HttpRequest};
use actix_web::dev::Payload;
use actix_web::error::ErrorUnauthorized;
use futures::future::{ready, Ready};

pub struct LoggedUser {
    pub id: String,
}

impl FromRequest for LoggedUser {
    type Error = Error;
    type Future = Ready<Result<LoggedUser, Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        return match Identity::from_request(req, &mut Payload::None).into_inner() {
            Ok(identity) => {
                match identity.id() {
                    Ok(id) => {
                        ready(Ok(LoggedUser { id }))
                    }
                    Err(_) => ready(Err(ErrorUnauthorized("Unauthorized")))
                }
            }
            Err(_) => ready(Err(ErrorUnauthorized("Unauthorized")))
        };
    }
}
