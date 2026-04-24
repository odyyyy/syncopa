from typing import Literal, Self

from fastapi.datastructures import UploadFile
from pydantic import field_validator, model_validator
from pydantic.main import BaseModel
from pydantic.networks import EmailStr
from pydantic.types import UUID4
from tortoise.contrib.pydantic import pydantic_model_creator

from auth.schemas import UserValidatorsMixin
from projects_management.models.invitations import InvitationStatus
from shared.base_schema import BaseSchema
from users.models import Users


class UserOut(BaseSchema):
    id: UUID4
    username: str
    email: str
    avatar: str | None = None
    role: str


UserIn = pydantic_model_creator(
    Users, name="UserIn", model_config=BaseSchema.model_config
)


class UserUpdateIn(BaseSchema):
    email: EmailStr | None = None
    username: str | None = None
    avatar: UploadFile | None = None
    old_password: str | None = None
    password: str | None = None

    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: EmailStr | None) -> EmailStr | None:
        if value is None:
            return value
        return UserValidatorsMixin.validate_email(value)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return UserValidatorsMixin.validate_username(value)

    @model_validator(mode="after")
    def check_passwords_match(self) -> Self:
        if (self.password is None) ^ (self.old_password is None):
            raise ValueError("Должны быть переданы старый и новый пароли")
        if (
            self.password == self.old_password
            and self.password is not None
            and self.old_password is not None
        ):
            raise ValueError("Новый пароль не может совпадать с старым")
        return self

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return UserValidatorsMixin.validate_password(value)

    @field_validator("old_password")
    @classmethod
    def validate_old_password(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return UserValidatorsMixin.validate_password(value)

    @field_validator("avatar")
    @classmethod
    def validate_avatar(cls, file: UploadFile | None) -> UploadFile | None:
        if file is None:
            return file
        if file.size is None:
            # TODO: get file size from stream
            raise ValueError("Размер файла неизвестен")

        if file.size > 1024 * 1024:
            raise ValueError("Размер файла не должен превышать 1 Мб")
        from users.services import supported_images_extensions
        
        if file.content_type not in supported_images_extensions.keys():
            raise ValueError(
                "Файл должен быть изображением (JPEG, PNG, WEBP, JPG, GIF)"
            )
        return file


class UserUpdateOut(BaseModel):
    email: EmailStr | None = None
    username: str | None = None
    avatar: str | None = None


class Invitation(BaseSchema):
    id: UUID4
    sender_username: str
    project_title: str


class InvitationUpdate(BaseModel):
    status: Literal[InvitationStatus.ACCEPTED, InvitationStatus.REJECTED]
