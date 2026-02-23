from users.models import Users


async def get_user_data(username: str):
    user = await Users.get_or_none(username=username)
    return user
