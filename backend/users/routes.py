from authx import TokenPayload
from fastapi import APIRouter, Depends, HTTPException, status

from auth.config import auth
from users.schemas import UserOut
from users.services import get_user_data

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.get("/me", response_model=UserOut)
async def get_current_user_info(
    payload: TokenPayload = Depends(auth.access_token_required),
):
    print(payload)
    user_data = await get_user_data(payload.sub)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return await UserOut.from_tortoise_orm(user_data)
