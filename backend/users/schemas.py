from tortoise.contrib.pydantic import pydantic_model_creator

from shared.base_schema import BaseSchema
from users.models import Users

UserCreate = pydantic_model_creator(
    Users, name="UserCreate", model_config=BaseSchema.model_config
)
UserRead = pydantic_model_creator(
    Users, name="UserRead", model_config=BaseSchema.model_config, exclude_readonly=True
)
