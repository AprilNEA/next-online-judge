use crate::entity::Role;
use crate::error::AppError;
use actix_identity::Identity;
use actix_session::Session;
use actix_web::dev::Extensions;

pub(crate) fn login_with_role(
    session: Session,
    extension: &Extensions,
    id: String,
    role: Role,
) -> Result<(), AppError> {
    Identity::login(&extension, id).map_err(|_e| AppError::SessionError)?;
    session
        .insert("role", role)
        .map_err(|_e| AppError::SessionError)?;

    Ok(())
}

pub fn parse_user_id(user: Identity) -> i32 {
    user.id().unwrap().parse::<i32>().unwrap()
}
