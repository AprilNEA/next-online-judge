use actix_identity::Identity;

pub fn parse_user_id(user: Identity) -> i32 {
    user.id().unwrap().parse::<i32>().unwrap()
}
