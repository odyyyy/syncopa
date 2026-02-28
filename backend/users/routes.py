from fastapi import APIRouter, HTTPException, status

from shared.dependencies import AccessTokenRequiredPayload
from users.schemas import Invitation, UserOut, UserUpdate
from users.services import (
    get_matched_users_by_username,
    get_user_by_id,
    get_user_invitations,
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
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return user_data


@users_router.get("/")
async def search_users_by_username(username: str):
    users = await get_matched_users_by_username(username.strip())
    return users


@users_router.patch("/update", response_model=UserOut)
async def update_user_account_info(
    user_update_data: UserUpdate,
    payload: AccessTokenRequiredPayload,
):
    user_data = await get_user_by_id(payload.sub)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return user_data


@users_router.get("/me/invitations", response_model=list[Invitation])
async def user_invitations_list(user_payload: AccessTokenRequiredPayload):
    user_invitations = await get_user_invitations(user_payload.sub)
    print(user_invitations)
    return user_invitations
