from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from tortoise.exceptions import DoesNotExist

from auth.config import setup_auth
from auth.routes import auth_router

from .exceptions_handlers import (
    does_not_exist_handler,
    general_exception_handler,
    validation_exception_handler,
    value_error_handler,
)
from .settings import lifespan, settings

app = FastAPI(
    title="Syncopa API",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)

# Routers
app.include_router(auth_router)

# Auth
setup_auth(app)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add Exception Handlers
app.add_exception_handler(DoesNotExist, does_not_exist_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, general_exception_handler)
