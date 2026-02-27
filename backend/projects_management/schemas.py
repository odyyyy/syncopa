from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import Field, field_validator

from shared.base_schema import BaseSchema
from users.schemas import UserOut


class ProjectOut(BaseSchema):
    id: UUID
    title: str
    owner: UserOut
    members: list[UserOut]
    modified_at: datetime


class ProjectIn(BaseSchema):
    title: str = Field(min_length=3, max_length=64)
    invited_members: list[str] = Field(
        default_factory=list, min_length=0, max_length=10
    )

    @field_validator("invited_members")
    @classmethod
    def validate_members(cls, v: list[str]) -> list[str]:
        if len(v) > 10:
            raise ValueError("Нельзя пригласить больше 10 пользователей")
        return v
