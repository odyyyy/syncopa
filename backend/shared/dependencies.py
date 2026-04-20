from typing import Annotated

from authx import TokenPayload
from fastapi import Depends
from redis.asyncio import Redis as RedisAsync

from auth.config import auth

AccessTokenRequiredPayload = Annotated[
    TokenPayload,
    Depends(auth.access_token_required),
]

RefreshTokenRequiredPayload = Annotated[
    TokenPayload,
    Depends(auth.refresh_token_required),
]


async def get_redis_auth() -> RedisAsync:
    from core.main import app

    return app.state.redis_auth


async def get_redis_coop() -> RedisAsync:
    from core.main import app

    return app.state.redis_coop


RedisAuthDep = Annotated[RedisAsync, Depends(get_redis_auth)]
RedisCoopDep = Annotated[RedisAsync, Depends(get_redis_coop)]
