from pydantic.types import UUID4
from tortoise.contrib.pydantic import pydantic_model_creator

from shared.base_schema import BaseSchema
from users.models import Users


class UserOut(BaseSchema):
    id: UUID4
    username: str
    email: str
    avatar: str | None = None
    role: str


class UserUpdate(BaseSchema):
    email: str | None = None
    name: str | None = None
    avatar: str | None = None
    password: str | None = None


UserIn = pydantic_model_creator(
    Users, name="UserIn", model_config=BaseSchema.model_config
)


class Invitation(BaseSchema):
    id: UUID4
    sender_username: str
    project_title: str
