from fastapi import APIRouter

from auth.schemas import RegisterPayload
from auth.services import create_user
from shared.dependencies import AccessTokenRequiredPayload
from users.schemas import UserCreate

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register")
async def register(data: RegisterPayload):
    user = await create_user(data)
    return await UserCreate.from_tortoise_orm(user)

@auth_router.post("/login")
async def login():
    pass



@auth_router.get("/me")
def get_me(payload: AccessTokenRequiredPayload):
    return {
        "user_id": payload.sub,
        "token_type": payload.type,
        "is_fresh": payload.fresh,
    }


@auth_router.get("/token-info")
def token_info(payload: AccessTokenRequiredPayload):
    return {
        "user_id": payload.sub,
        "issued_at": payload.issued_at.isoformat(),
        "expires_at": payload.expiry_datetime.isoformat(),
        "time_until_expiry": str(payload.time_until_expiry),
        "time_since_issued": str(payload.time_since_issued),
        "is_fresh": payload.fresh,
        "custom_data": payload.extra_dict,
    }
