from datetime import UTC, datetime

from authx.exceptions import AuthXException
from authx.schema import RequestToken
from fastapi import Request
from tortoise import transactions

from shared.dependencies import RedisAsync
from users.models import Role, Users

from .config import auth
from .exceptions import AuthException
from .schemas import LoginPayload, RegisterPayload
from .utils import hash_password, verify_password

BLACKLIST_TAG = "blacklist"


@transactions.atomic()
async def create_user(user_data: RegisterPayload) -> Users:

    if await Users.get_or_none(email=user_data.email) is not None:
        raise ValueError("Пользователь с таким email уже существует")

    if await Users.get_or_none(username=user_data.username) is not None:
        raise ValueError("Пользователь с таким никнеймом уже существует")

    created_user = await Users.create(
        username=user_data.username,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role=Role.USER.value,
    )
    return created_user


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
        payload = auth.verify_token(refresh_token)
        if await redis_auth.exists(f"{BLACKLIST_TAG}:{payload.jti}"):
            raise AuthException("Токен недействителен")

        new_access_token = auth.create_access_token(uid=payload.sub)

        return new_access_token

    except AuthXException:
        raise AuthException("Сессия истекла")  # noqa: B904


async def add_token_in_blacklist(
    refresh_token: RequestToken, redis_auth: RedisAsync
) -> None:
    payload = auth.verify_token(refresh_token)

    exp_at = payload.expiry_datetime
    if refresh_token and exp_at > datetime.now(UTC):
        await redis_auth.set(
            f"{BLACKLIST_TAG}:{payload.jti}",
            "1",
            exat=exp_at,
        )
