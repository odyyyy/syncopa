from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI
from pydantic_settings import BaseSettings

from core.database import get_postgres_config, register_orm

# ====== Global settings ======


class Settings(BaseSettings):
    DEBUG: bool = True

    # CORS Config
    CORS_ALLOW_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


    # Auth
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE: int
    REFRESH_TOKEN_EXPIRE: int

    class Config:
        env_file = ".env"


settings = Settings()

# Tortoise ORM Configuration (put it outside Settings class because tortoise migration tool cant read property from settings object)
TORTOISE_ORM: dict = {
        "connections": {
            "default": get_postgres_config().DATABASE_URI_tortoise,
        },
        "apps": {
            "models": {
                "models": ["auth.models", "users.models"],
                "default_connection": "default",
                "migrations": "migrations",
            },
        },
    }

# ====== Databases connection lifespan ======

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    async with register_orm(app):
        # db connected
        yield
        # app teardown
