from fastapi.routing import APIRouter
from pydantic.types import UUID4

from .schemas import ProjectIn, ProjectOut

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.get("/")
async def projects_list(user_id: UUID4):
    return {"message": "Projects list"}


@project_router.get("/{project_uuid}")
async def project_details(project_id: UUID4):
    return {"message": f"Project details for project ID {project_id}"}


@project_router.post("/", response_class=ProjectOut)
async def project_create(project_data: ProjectIn):
    return project_data


@project_router.put("/{project_uuid}")
async def project_update(project_id: UUID4):
    return {"message": f"Project updated for project ID {project_id}"}


@project_router.delete("/{project_uuid}")
async def project_delete(project_id: UUID4):
    return {"message": f"Project deleted for project ID {project_id}"}
