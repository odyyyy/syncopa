from datetime import datetime

from pydantic import UUID4, Field, field_validator

from auth.schemas import UserValidatorsMixin
from shared.base_schema import BaseSchema


class ProjectMember(BaseSchema):
    id: UUID4
    username: str
    avatar: str | None = None


class ProjectOut(BaseSchema):
    id: UUID4
    title: str
    invited_members: list[ProjectMember]
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


class InvitedMembers(BaseSchema):
    members: list[str] = Field(
        default_factory=list,
        min_length=1,
        max_length=9,
    )

    @field_validator("members")
    @classmethod
    def validate_members(cls, values: list[str]) -> list[str]:
        validated = []
        for value in values:
            if value is not None:
                validated.append(UserValidatorsMixin.validate_username(value))
        return validated
