from typing import Annotated

from authx import TokenPayload
from fastapi import Depends
from redis.asyncio import Redis as RedisAsync

from auth.config import auth
from core.database import redis_client

AccessTokenRequiredPayload = Annotated[
    TokenPayload,
    Depends(auth.access_token_required),
]

RefreshTokenRequiredPayload = Annotated[
    TokenPayload,
    Depends(auth.refresh_token_required),
]


async def get_redis() -> RedisAsync:
    return redis_client
