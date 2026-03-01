import re

from pydantic import field_validator
from pydantic.networks import EmailStr

from shared.base_schema import BaseSchema


class UserValidatorsMixin:
    @field_validator("email", mode="before")
    @classmethod
    def validate_email(cls, value: str) -> str:
        EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
        if not EMAIL_REGEX.fullmatch(value) or len(value) > 254:
            raise ValueError("Некорректный email")
        return value

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        if len(value) < 3 or len(value) > 30:
            raise ValueError("Длина никнейма должна быть от 3 до 30 символов")
        if not re.compile(r"^[A-Za-z0-9_]+$").fullmatch(value):
            raise ValueError("В никнейме могут быть только буквы, цифры и символ '_'")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Пароль должен содержать не менее 8 символов")

        if len(value) > 64:
            raise ValueError("Пароль должен содержать менее 65 символов")

        if not re.search(r"\d", value):
            raise ValueError("Пароль должен содержать хотя бы одну цифру")

        if not re.search(r"[a-z]", value):
            raise ValueError("Пароль должен содержать хотя бы одну строчную букву")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Пароль должен содержать хотя бы одну заглавную букву")

        return value


class RegisterPayload(UserValidatorsMixin, BaseSchema):
    email: EmailStr
    username: str
    password: str


class LoginPayload(BaseSchema):
    email: EmailStr
    password: str
