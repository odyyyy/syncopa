from authx import TokenPayload
from fastapi import APIRouter, Depends, File, Form, UploadFile

from auth.config import auth
from core.settings import get_settings
from shared.dependencies import AccessTokenRequiredPayload
from users.schemas import Invitation, UserOut, UserUpdateIn, UserUpdateOut
from users.services import (
    get_matched_users_by_username,
    get_user_avatar_base64,
    get_user_by_id,
    get_user_invitations,
    update_user_data,
)

users_router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@users_router.get("/me", response_model=UserOut)
async def get_current_user_info(
    payload: AccessTokenRequiredPayload,
):
    user_data = await get_user_by_id(payload.sub)
    user_data.avatar = await get_user_avatar_base64(
        get_settings().BASE_AVATARS_DIR / user_data.avatar
    )
    return user_data


@users_router.get("/")
async def search_users_by_username(username: str):
    users = await get_matched_users_by_username(username.strip())
    return users


@users_router.patch("/", response_model=UserUpdateOut, response_model_exclude_none=True)
async def update_user_account_info(
    email: str | None = Form(None),
    username: str | None = Form(None),
    old_password: str | None = Form(None),
    password: str | None = Form(None),
    avatar: UploadFile | None = File(None),
    payload: TokenPayload = Depends(auth.access_token_required),
):
    user_update_data = UserUpdateIn(
        email=email,
        username=username,
        old_password=old_password,
        password=password,
        avatar=avatar,
    )
    updated_data = await update_user_data(payload.sub, user_update_data)
    return updated_data


@users_router.get("/me/invitations", response_model=list[Invitation])
async def user_invitations_list(user_payload: AccessTokenRequiredPayload):
    user_invitations = await get_user_invitations(user_payload.sub)
    return user_invitations
