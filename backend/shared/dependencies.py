from typing import Annotated, AsyncGenerator

from fastapi.params import Depends
from pymongo.asynchronous.database import AsyncDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from core.settings import mongo_manager, postgres_manager


async def get_postgres_session() -> AsyncGenerator[AsyncSession, None]:
    sessionmaker = postgres_manager.get_sessionmaker()
    async with sessionmaker() as session:
        yield session

PostgresDep = Annotated[AsyncSession, Depends(get_postgres_session)]


async def get_mongo_db_session() -> AsyncDatabase:
    return mongo_manager.get_database()

MongoDep = Annotated[AsyncDatabase, Depends(get_mongo_db_session)]
