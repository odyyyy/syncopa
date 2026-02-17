from fastapi import FastAPI

from auth.routes import auth_router
from core.settings import lifespan, settings

app = FastAPI(
    title="Syncopa API",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)

app.include_router(auth_router)
