from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI
from pydantic_settings import BaseSettings

from core.database import register_orm, setup_redis_clients


# ====== Global settings ======
class Settings(BaseSettings):
    DEBUG: bool = True
    BASE_DIR: Path = Path(__file__).parent.parent
    BASE_AVATARS_DIR: Path = BASE_DIR / "users/users_files/"
    BASE_DAW_DIR: Path = BASE_DIR / "daw/daw_files/"

    # CORS Config
    CORS_ALLOW_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Postgres connection config
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @property
    def DATABASE_URI_tortoise(self) -> str:
        return (
            f"postgres://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}"
            f"/{self.POSTGRES_DB}"
        )

    # Redis connection config
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_USER: str
    REDIS_PASSWORD: str
    REDIS_DB_AUTH: int
    REDIS_DB_COOP: int

    @property
    def REDIS_AUTH_DB_URI(self) -> str:
        return (
            f"redis://"
            f":{self.REDIS_PASSWORD}"
            f"@{self.REDIS_HOST}:{self.REDIS_PORT}"
            f"/{self.REDIS_DB_AUTH}"
        )

    @property
    def REDIS_COOP_DB_URI(self) -> str:
        return (
            f"redis://"
            f":{self.REDIS_PASSWORD}"
            f"@{self.REDIS_HOST}:{self.REDIS_PORT}"
            f"/{self.REDIS_DB_COOP}"
        )

    # Auth
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE: int
    REFRESH_TOKEN_EXPIRE: int

    class Config:
        env_file = ".env"


@lru_cache
def get_settings():
    return Settings()


# Tortoise ORM Configuration (put it outside Settings class because tortoise migration tool cant read property from settings object)
TORTOISE_ORM: dict = {
    "connections": {
        "default": get_settings().DATABASE_URI_tortoise,
    },
    "apps": {
        "models": {
            "models": [
                "users.models",
                "projects_management.models",
                "projects_management.signals",
                "daw.models",
                "vcs.models",
            ],
            "default_connection": "default",
            "migrations": "migrations",
        },
    },
}


# ====== App lifespan ======
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    # Redis
    redis_auth, redis_coop = await setup_redis_clients()

    await redis_auth.ping()
    await redis_coop.ping()

    app.state.redis_auth = redis_auth
    app.state.redis_coop = redis_coop

    async with register_orm(app):
        # db connected
        yield
        # app teardown

    await app.state.redis_auth.close()
    await app.state.redis_coop.close()
