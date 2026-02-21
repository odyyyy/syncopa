from fastapi import FastAPI
from redis.asyncio import Redis
from tortoise.contrib.fastapi import RegisterTortoise


# Tortoise ORM initialization
def register_orm(app: FastAPI):
    from .settings import TORTOISE_ORM

    return RegisterTortoise(
        app=app,
        config=TORTOISE_ORM,
        add_exception_handlers=True,
        generate_schemas=False,
    )


# Redis
async def setup_redis_client():
    from core.settings import get_settings

    redis_client = Redis.from_url(
        url=get_settings().REDIS_AUTH_DB_URI,
        decode_responses=True,
    )
    return redis_client
