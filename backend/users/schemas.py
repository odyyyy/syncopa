from tortoise.contrib.pydantic import pydantic_model_creator

from shared.base_schema import BaseSchema
from users.models import Users

UserIn = pydantic_model_creator(
    Users, name="UserIn", model_config=BaseSchema.model_config
)
UserOut = pydantic_model_creator(
    Users, name="UserOut", model_config=BaseSchema.model_config, exclude_readonly=True
)

UserUpdate = pydantic_model_creator(
    Users,
    name="UserUpdate",
    model_config=BaseSchema.model_config,
    include=("email", "name", "avatar"),
    optional=("email", "name", "avatar"),
)
