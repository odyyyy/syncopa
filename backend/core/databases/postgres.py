from functools import lru_cache
from typing import AsyncGenerator

from pydantic_settings import BaseSettings
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)


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

    class Config:
        env_file = ".env"


@lru_cache
def get_postgres_config() -> PostgresConfig:
    return PostgresConfig()


class PostgresManager:
    def __init__(
        self,
        uri: str,
        echo: bool = False,
        pool_size: int = 5,
        max_overflow: int = 10,
    ):
        self._uri = uri
        self._echo = echo
        self._pool_size = pool_size
        self._max_overflow = max_overflow

        self.engine: AsyncEngine | None = None
        self._sessionmaker: async_sessionmaker[AsyncSession] | None = None

    async def connect(self) -> None:
        if self.engine:
            return

        self.engine = create_async_engine(
            url=self._uri,
            echo=self._echo,
            pool_size=self._pool_size,
            max_overflow=self._max_overflow,
            pool_pre_ping=True,
        )

        async with self.engine.connect() as conn:
            await conn.execute(text("SELECT 1"))

        self._sessionmaker = async_sessionmaker(
            self.engine,
            expire_on_commit=False,
            autoflush=False,
        )

    async def close(self) -> None:
        if self.engine:
            await self.engine.dispose()
            self.engine = None
            self._sessionmaker = None

    def get_sessionmaker(self) -> async_sessionmaker[AsyncSession]:
        if not self._sessionmaker:
            raise RuntimeError("PostgresManager is not connected")
        return self._sessionmaker

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        sessionmaker = self.get_sessionmaker()
        async with sessionmaker() as session:
            yield session
