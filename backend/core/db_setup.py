from db_config import mongo_settings, postgres_settings
from pymongo import AsyncMongoClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

# MongoDB
mongo_client = AsyncMongoClient(mongo_settings.DATABASE_URI_pymongo)
mongo_db = mongo_client[mongo_settings.MONGO_DB]

# Postgres
async_postgres_engine = create_async_engine(
    url=postgres_settings.DATABASE_URI_asyncpg, echo=False, pool_size=5, max_overflow=10
)

postgres_session = async_sessionmaker(
    async_postgres_engine, expire_on_commit=False, autoflush=False, autocommit=False
)
