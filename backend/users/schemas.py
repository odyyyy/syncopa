from tortoise.contrib.pydantic import pydantic_model_creator

from users.models import Users

UserCreate = pydantic_model_creator(Users, name="UserCreate")
UserRead = pydantic_model_creator(Users, name="UserRead", exclude_readonly=True)
