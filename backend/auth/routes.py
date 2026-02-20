from fastapi import APIRouter, Depends, Request, Response, status
from fastapi.responses import JSONResponse

from auth.config import auth
from auth.schemas import LoginPayload, RegisterPayload
from auth.services import (
    add_token_in_blacklist,
    create_user,
    get_authenticated_user,
    get_new_access_token,
)

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
async def logout(request: Request, response: Response):
    auth.unset_refresh_cookies(response)

    refresh_token = await auth.get_refresh_token_from_request(request)

    await add_token_in_blacklist(refresh_token)

    return {"detail": "Вы вышли из аккаунта"}


@auth_router.post("/refresh")
async def refresh(request: Request):
    new_access_token = await get_new_access_token(request)
    return {"access_token": new_access_token}

