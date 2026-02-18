from functools import lru_cache

from fastapi import FastAPI
from pydantic_settings import BaseSettings
from tortoise.contrib.fastapi import RegisterTortoise


class PostgresConfig(BaseSettings):
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @property
    def DATABASE_URI_asyncpg(self) -> str:
        return (
            f"postgresql+asyncpg://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}"
            f"/{self.POSTGRES_DB}"
        )

    @property
    def DATABASE_URI_tortoise(self) -> str:
        return (
            f"postgres://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}"
            f"/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"


@lru_cache
def get_postgres_config() -> PostgresConfig:
    return PostgresConfig()


def register_orm(app: FastAPI):
    from .settings import TORTOISE_ORM

    return RegisterTortoise(
        app=app,
        config=TORTOISE_ORM,
        add_exception_handlers=True,
        generate_schemas=False,
    )
