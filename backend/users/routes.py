from authx import TokenPayload
from fastapi import APIRouter, Depends, HTTPException, status

from auth.config import auth
from shared.dependencies import AccessTokenRequiredPayload
from users.schemas import UserOut, UserUpdate
from users.services import get_user_by_username, get_users_by_username

users_router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@users_router.get("/me", response_model=UserOut)
async def get_current_user_info(
    payload: AccessTokenRequiredPayload,
):
    user_data = await get_user_by_username(payload.sub)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return await UserOut.from_tortoise_orm(user_data)


@users_router.get("/")
async def search_users_by_username(username: str):
    users = await get_users_by_username(username.strip())
    return users


@users_router.patch("/update", response_model=UserOut)
async def update_user_account_info(
    user_update_data: UserUpdate,
    payload: AccessTokenRequiredPayload,
):
    user_data = await get_user_by_username(payload.sub)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return await UserOut.from_tortoise_orm(user_data)
