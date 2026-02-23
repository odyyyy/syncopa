from datetime import timedelta

from authx import AuthX, AuthXConfig
from fastapi import FastAPI

from core.settings import get_settings

auth_config = AuthXConfig(
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=get_settings().ACCESS_TOKEN_EXPIRE),
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=get_settings().REFRESH_TOKEN_EXPIRE),
    JWT_SECRET_KEY=get_settings().JWT_SECRET_KEY,
    JWT_TOKEN_LOCATION=["cookies", "headers"],
    JWT_COOKIE_MAX_AGE=60 * 60 * 24 * get_settings().REFRESH_TOKEN_EXPIRE,
    JWT_COOKIE_SECURE=False,  # !!! Set to True in production (requires HTTPS)
    JWT_COOKIE_HTTP_ONLY=True,
    JWT_COOKIE_SAMESITE="lax",
    JWT_REFRESH_COOKIE_NAME="refresh_token_cookie",
    JWT_REFRESH_CSRF_COOKIE_NAME="csrf_refresh_token",
    JWT_REFRESH_CSRF_HEADER_NAME="X-CSRF-TOKEN",
    JWT_COOKIE_CSRF_PROTECT=True,
)

auth = AuthX(config=auth_config)


def setup_auth(app: FastAPI):
    auth.handle_errors(app)
