from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic_settings import BaseSettings

from core.databases.mongo import MongoManager, get_mongo_config
from core.databases.postgres import PostgresManager, get_postgres_config

# ====== Global settings ======

class Settings(BaseSettings):
    DEBUG: bool = True
    

settings = Settings()


# ====== Databases connection lifespan ======
mongo_manager = MongoManager(
    get_mongo_config().DATABASE_URI_pymongo,
    get_mongo_config().MONGO_DB,
)

postgres_manager = PostgresManager(
    get_postgres_config().DATABASE_URI_asyncpg,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await mongo_manager.connect()
    await postgres_manager.connect()
    yield
    await postgres_manager.close()
    await mongo_manager.close()

