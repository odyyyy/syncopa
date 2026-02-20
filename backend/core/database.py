import redis.asyncio as redis
from fastapi import FastAPI
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
redis_client = redis.Redis()
