from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from pydantic.types import UUID4

from projects_management.services import (
    create_project_and_invite_members,
    delete_project,
    get_user_projects,
)
from shared.dependencies import AccessTokenRequiredPayload

from .schemas import ProjectIn

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.get("")
async def projects_list(user_payload: AccessTokenRequiredPayload):
    user_projects = await get_user_projects(user_payload.sub)
    return JSONResponse(
        content=[
            {
                "id": str(project.id),
                "title": str(project.title),
                "members": list(project.invited_members),
                "modifiedAt": str(project.modified_at),
            }
            for project in user_projects
        ]
    )


@project_router.post("", status_code=201)
async def project_create(
    project_data: ProjectIn, user_payload: AccessTokenRequiredPayload
):
    created_project = await create_project_and_invite_members(
        project_data, user_payload.sub
    )
    return {
        "id": created_project.id,
        "title": created_project.title,
        "modifiedAt": str(created_project.modified_at),
    }


@project_router.put("/{project_id}")
async def project_update(project_id: UUID4):
    return {"message": f"Project updated for project ID {project_id}"}


@project_router.delete("/{project_id}")
async def project_delete(project_id: UUID4, user_payload: AccessTokenRequiredPayload):
    deleted_project = await delete_project(project_id, user_payload.sub)
    return {"title": deleted_project.title, "id": deleted_project.id}


@project_router.get("/{project_id}")
async def project_details(project_id: UUID4):
    return {"message": f"Project details for project ID {project_id}"}
