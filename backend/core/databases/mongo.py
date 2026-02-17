from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase


class MongoConfig(BaseSettings):
    MONGO_HOST: str
    MONGO_PORT: int
    MONGO_USER: str
    MONGO_PASSWORD: str
    MONGO_DB: str
    MONGO_AUTH_SOURCE: str

    @property
    def DATABASE_URI_pymongo(self) -> str:
        return (
            f"mongodb://{self.MONGO_USER}:{self.MONGO_PASSWORD}"
            f"@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DB}"
        )

    class Config:
        env_file = ".env"


@lru_cache
def get_mongo_config() -> MongoConfig:
    return MongoConfig()


class MongoManager:
    def __init__(self, uri: str, db_name: str):
        self._uri = uri
        self._db_name = db_name
        self._client: Optional[AsyncMongoClient] = None
        self._db: Optional[AsyncDatabase] = None

    async def connect(self) -> None:
        if self._client:
            return

        self._client = AsyncMongoClient(self._uri)

        self._db = self._client[self._db_name]

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None
            self._db = None

    def get_database(self) -> AsyncDatabase:
        if self._db is None:
            raise RuntimeError("MongoManager is not connected")
        return self._db
