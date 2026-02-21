import hashlib
from datetime import datetime, timezone

from authx.schema import RequestToken
from fastapi import HTTPException, Request, status
from tortoise import transactions
from tortoise.contrib.pydantic import PydanticModel

from auth.config import auth
from auth.schemas import LoginPayload, RegisterPayload
from shared.dependencies import RedisAsync
from users.models import Users
from users.schemas import UserCreate

from .utils import hash_password, verify_password

BLACKLIST_TAG = "blacklist"


@transactions.atomic()
async def create_user(user_data: RegisterPayload) -> PydanticModel:

    if await Users.get_or_none(email=user_data.email) is not None:
        raise ValueError("Пользователь с таким email уже существует")

    if await Users.get_or_none(username=user_data.username) is not None:
        raise ValueError("Пользователь с таким никнеймом уже существует")

    created_user = await Users.create(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )

    user = await UserCreate.from_tortoise_orm(created_user)
    return user


async def get_authenticated_user(user_data: LoginPayload) -> Users:
    user = await Users.get_or_none(email=user_data.email)
    if user is None:
        raise ValueError("Неверный Email")

    if not verify_password(user.password_hash, user_data.password):
        raise ValueError("Неверный пароль")

    return user


async def get_new_access_token(request: Request, redis_auth: RedisAsync) -> str:
    try:
        refresh_token = await auth.get_refresh_token_from_request(request)
        print("GET NEW ACCESS GET NEW ACCESSS!!!!!!!!!!!!!!!!")
        print(refresh_token)
        print(request.headers)
        print(request.cookies)
        if await redis_auth.exists(
            f"{BLACKLIST_TAG}:{hashlib.sha256(refresh_token.token.encode()).hexdigest()}"
        ):
            raise HTTPException(
                status_code=status.HTTP_403_UNAUTHORIZED,
                detail="Доступ к ресурсу запрещен",
            )

        payload = auth.verify_token(refresh_token)

        new_access_token = auth.create_access_token(uid=payload.sub)

        return new_access_token

    except Exception:
        raise HTTPException(status_code=401, detail="Сессия истекла")


async def add_token_in_blacklist(refresh_token: RequestToken, redis_auth: RedisAsync) -> None:
    payload = auth.verify_token(refresh_token)

    exp_at = payload.expiry_datetime
    if refresh_token and exp_at > datetime.now(timezone.utc):
        await redis_auth.set(
            f"{BLACKLIST_TAG}:{hashlib.sha256(refresh_token.token.encode()).hexdigest()}",
            "1",
            exat=exp_at,
        )
