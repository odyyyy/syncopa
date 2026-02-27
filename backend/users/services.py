from tortoise.exceptions import DoesNotExist

from users.models import Users


async def get_user_by_username(username: str):
    user = await Users.get_or_none(username=username)
    if user is None:
        raise DoesNotExist("Пользователь не найден")
    return user


async def get_users_by_username(username: str):
    users = await Users.filter(username__icontains=username).values(
        "username", "avatar"
    )
    return users
