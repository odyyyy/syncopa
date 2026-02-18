
from auth.schemas import RegisterPayload
from users.models import Users
from users.utils import hash_password


async def create_user(data: RegisterPayload):
    
    if await Users.get_or_none(email=data.email) is not None:
        raise ValueError("Пользователь с таким email уже существует")

    if await Users.get_or_none(username=data.username) is not None:
        raise ValueError("Пользователь с таким никнеймом уже существует")

    return await Users.create(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
