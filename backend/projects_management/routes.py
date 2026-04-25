import asyncio

from fastapi import Depends, status
from fastapi.routing import APIRouter
from starlette.responses import JSONResponse

from projects_management.models.projects import Projects
from projects_management.permissions import require_project_owner_permission
from projects_management.services import (
    create_project_and_invite_members,
    delete_project,
    get_user_projects,
    invite_members,
    serialize_project,
)
from shared.dependencies import AccessTokenRequiredPayload

from .schemas import InvitedMembers, ProjectIn, ProjectOut

project_router = APIRouter(prefix="/projects", tags=["projects"])


@project_router.get("", response_model=list[ProjectOut])
async def list_projects(user_payload: AccessTokenRequiredPayload):
    projects = await get_user_projects(user_payload.sub)
    return await asyncio.gather(
        *(serialize_project(p, user_payload.sub) for p in projects)
    )


@project_router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
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


@project_router.delete("/{project_id}")
async def remove_project(
    project: Projects = Depends(require_project_owner_permission),
):
    deleted_project = await delete_project(project)

    return {
        "title": deleted_project.title,
        "id": deleted_project.id,
    }


@project_router.post("/{project_id}/invitations")
async def invite_member(
    members: InvitedMembers,
    project: Projects = Depends(require_project_owner_permission),
):
    await invite_members(project, members.members)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"detail": "Приглашения успешно отправлены"},
    )
