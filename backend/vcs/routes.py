from fastapi import APIRouter, Depends
from pydantic import UUID4

from auth.config import auth
from daw.models.projects_payloads import ProjectsPayloads
from daw.schemas.project_payload import ProjectPayload
from projects_management.permissions import require_project_member_or_owner_permission
from shared.dependencies import AccessTokenRequiredPayload
from vcs.schemas import BranchCreateIn, BranchCreateOut
from vcs.services import (
    create_new_project_branch,
    get_project_branches_with_versions_metadata,
)

vcs_router = APIRouter(
    prefix="/vcs/projects",
    tags=["vcs"],
    dependencies=[Depends(auth.access_token_required)],
)


@vcs_router.post("/{project_id}/versions")
async def create_project_version(
    project_id: UUID4, branch: str, payload: ProjectPayload
):
    pass


@vcs_router.get("/{project_id}/versions")
async def list_project_versions(project_id: UUID4):
    pass


@vcs_router.get("/{project_id}/versions/{branch}")
async def list_project_versions_on_branch(project_id: UUID4, branch: str):
    pass


@vcs_router.get("/{project_id}/versions/{version_id}")
async def get_project_version(project_id: UUID4, version_id: UUID4):
    pass


@vcs_router.post("/{project_id}/versions/{version_id}/switch")
async def switch_to_project_version(project_id: UUID4, version_id: UUID4):
    pass


@vcs_router.post("/{project_id}/versions/{version_id}/revert")
async def revert_to_project_version(project_id: UUID4, version_id: UUID4):
    pass


@vcs_router.get("/{project_id}/branches")
async def get_project_vcs_info(
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    return await get_project_branches_with_versions_metadata(
        project_with_payload.project
    )


@vcs_router.post("/{project_id}/branches", response_model=BranchCreateOut)
async def create_project_branch(
    user_payload: AccessTokenRequiredPayload,
    branch_payload: BranchCreateIn,
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    branch_with_initial_version = await create_new_project_branch(
        project_with_payload.project,
        user_payload.sub,
        branch_payload.project_snapshot,
        branch_payload.branch_title,
    )
    return branch_with_initial_version


@vcs_router.get("/{project_id}/branches/{branch}")
async def get_project_branch(project_id: UUID4, branch: str):
    pass


@vcs_router.post("/{project_id}/branches/merge")
async def merge_project_branches(project_id: UUID4, branch: str):
    pass
