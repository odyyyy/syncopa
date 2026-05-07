from tortoise import Tortoise


async def _get_db_connection():
    return Tortoise.get_connection("default")

