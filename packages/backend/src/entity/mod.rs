pub mod problem;
pub mod user;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgRow, PgPool};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "role", rename_all = "UPPERCASE")]
pub enum Role {
    User,
    Admin,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "language", rename_all = "UPPERCASE")]
pub enum Language {
    C,
    Go,
    Cpp,
    Rust,
    Python,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "submission_status")]
pub enum SubmissionStatus {
    Pending,
    Compiling,
    Running,
    Accepted,
    CompileError,
    WrongAnswer,
    TimeLimitExceeded,
    RunningError,
    MemoryLimitExceeded,
    PresentationError,
    OutputLimitExceeded,
    UnknownError,
}

#[derive(Deserialize)]
pub struct Paginator {
    #[serde(default = "default_page")]
    pub page: i64,
    #[serde(default = "default_size")]
    pub size: i64,
}
fn default_page() -> i64 {
    1
}
fn default_size() -> i64 {
    50
}
impl Paginator {
    pub fn new(page: i64, size: i64) -> Self {
        Self { page, size }
    }

    pub fn offset(&self) -> i64 {
        (self.page - 1) * self.size
    }

    pub fn limit(&self) -> i64 {
        self.size
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct PagedResult<T> {
    pub data: Vec<T>,
    pub total: i64,
    pub size: i64,
    pub total_pages: i64,
    pub current_page: i64,
    pub has_perv_page: bool,
    pub has_next_page: bool,
}

#[async_trait]
pub trait Paged: Send + Unpin + for<'r> sqlx::FromRow<'r, PgRow> {
    async fn paged(
        pool: &PgPool,
        paginator: &Paginator,
        // additional_query: &str,
        // bindings: &[&(dyn sqlx::Encode<'_, sqlx::Postgres> + std::marker::Sync)],
    ) -> sqlx::Result<PagedResult<Self>>
    where
        Self: Sized,
    {
        // Count total number of rows
        let total: i64 =
            sqlx::query_scalar::<_, i64>(&format!("SELECT COUNT(*) FROM {}", Self::table_name()))
                .fetch_one(pool)
                .await?;

        let total_pages = (total + paginator.size - 1) / paginator.size;

        // Fetch paged data
        let data = sqlx::query_as::<_, Self>(&format!(
            "SELECT * FROM {} LIMIT $1 OFFSET $2",
            Self::table_name()
        ))
        .bind(paginator.limit())
        .bind(paginator.offset())
        .fetch_all(pool)
        .await?;

        Ok(PagedResult {
            data,
            total,
            size: paginator.size,
            total_pages,
            current_page: paginator.page,
            has_perv_page: paginator.page > 1,
            has_next_page: paginator.page < total_pages,
        })
    }

    fn table_name() -> &'static str;
}
