from fastapi import APIRouter, Depends

from auth.config import auth
from daw.models import ProjectsPayloads
from daw.schemas import ProjectPayload, ProjectWithPayload
from daw.services import update_project_payload
from projects_management.models.projects import Projects
from projects_management.permissions import require_project_member_or_owner_permission
from projects_management.schemas import ProjectMember

daw_router = APIRouter(
    prefix="/daw", tags=["daw"], dependencies=[Depends(auth.access_token_required)]
)


@daw_router.get("/payload/{project_id}", response_model=ProjectWithPayload)
async def get_daw_project_with_payload(
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    invited_members = await project_with_payload.project.invited_members.all()

    return ProjectWithPayload(
        project_id=project_with_payload.project.id,
        title=project_with_payload.project.title,
        payload=project_with_payload.project_payload,
        invited_members=[
            ProjectMember(username=member.username, avatar=member.avatar)
            for member in invited_members
        ],
    )


@daw_router.put("/payload/{project_id}")
async def update_daw_project_payload(
    project_id: str,
    new_project_payload: ProjectPayload,
    project_with_payload: Projects = Depends(
        require_project_member_or_owner_permission
    ),
):
    project_payload = await update_project_payload(
        project_with_payload, new_project_payload
    )
    return project_payload
