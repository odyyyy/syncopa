from pymongo.asynchronous.database import AsyncDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, AsyncGenerator
from core.db_setup import mongo_db, postgres_session

from fastapi.params import Depends

async def get_postgres_session() -> AsyncGenerator[AsyncSession, None]:
    async with postgres_session() as session:
        yield session
        
PostgresDep = Annotated[AsyncSession, Depends(get_postgres_session)]

async def get_mongo_session() -> AsyncDatabase:
    return mongo_db

MongoDep = Annotated[AsyncDatabase, Depends(get_mongo_session)]