from fastapi import APIRouter, Request, Response, status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse

from auth.config import auth
from auth.schemas import LoginPayload, RegisterPayload
from auth.services import (
    add_token_in_blacklist,
    create_user,
    get_authenticated_user,
    get_new_access_token,
)
from shared.dependencies import RedisDep

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register")
async def register(user_data: RegisterPayload):
    created_user = await create_user(user_data)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED, content=created_user.model_dump_json()
    )


@auth_router.post("/login")
async def login(user_data: LoginPayload, response: Response):
    user = await get_authenticated_user(user_data)

    refresh_token = auth.create_refresh_token(uid=user.username)
    access_token = auth.create_access_token(uid=user.username)

    auth.set_refresh_cookies(refresh_token, response)

    return {"access_token": access_token}


@auth_router.post("/logout")
async def logout(request: Request, response: Response, redis: RedisDep):

    refresh_token = await auth.get_refresh_token_from_request(
        request, locations=["cookies"]
    )

    if refresh_token is not None:
        await add_token_in_blacklist(refresh_token, redis)
        auth.unset_refresh_cookies(response)
        return {"detail": "Вы вышли из аккаунта"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Данные не найдены",
        )


@auth_router.post("/refresh")
async def refresh(request: Request, redis: RedisDep):
    new_access_token = await get_new_access_token(request, redis)
    return {"access_token": new_access_token}
