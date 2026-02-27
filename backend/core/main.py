from fastapi import APIRouter, FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from tortoise.exceptions import DoesNotExist

from auth.config import setup_auth
from auth.exceptions import AuthException
from auth.routes import auth_router
from projects_management.routes import project_router
from users.routes import users_router

from .exceptions_handlers import (
    auth_exception_handler,
    does_not_exist_exception_handler,
    general_exception_handler,
    validation_exception_handler,
    value_exception_handler,
)
from .settings import get_settings, lifespan

app = FastAPI(
    title="Syncopa API",
    lifespan=lifespan,
    docs_url="/docs" if get_settings().DEBUG else None,
    redoc_url="/redoc" if get_settings().DEBUG else None,
    openapi_url="/openapi.json" if get_settings().DEBUG else None,
)

# Routers
api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(project_router)

app.include_router(api_router)

# Auth
setup_auth(app)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add Exception Handlers
app.add_exception_handler(DoesNotExist, does_not_exist_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(ValueError, value_exception_handler)
app.add_exception_handler(AuthException, auth_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)
