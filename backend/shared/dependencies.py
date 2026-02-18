from typing import Annotated

from authx import TokenPayload
from fastapi import Depends

from auth.config import auth

AccessTokenRequiredPayload = Annotated[
    TokenPayload,
    Depends(auth.access_token_required),
]
