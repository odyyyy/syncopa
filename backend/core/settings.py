from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.db_setup import mongo_client, async_postgres_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    
    await async_postgres_engine.dispose()
    await mongo_client.close()