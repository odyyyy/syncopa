from typing import Annotated

from fastapi import APIRouter, Depends, Query
from tortoise.exceptions import DoesNotExist

from auth.config import auth
from daw.models import Presets, ProjectsPayloads
from daw.models.presets import PresetsConfigs
from daw.schemas import ProjectPayload, ProjectWithPayload
from daw.schemas.preset import PresetConfig, PresetOut
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


@daw_router.get("/presets", response_model=list[PresetOut])
async def get_presets_catalog():
    return await Presets.all()


@daw_router.get("/presets")
async def get_presets_with_config_used_in_project(
    presets: Annotated[list[str], Query(pattern=r"^[a-z0-9-]{3,40}$")],
):
    presets_with_config_used_in_project = await get_presets_with_config_used_in_project(
        presets
    )
    return presets_with_config_used_in_project


@daw_router.get("/presets/{preset_id}", response_model=PresetConfig)
async def get_preset_config_by_id(preset_id: int):
    preset_config = await PresetsConfigs.get_or_none(preset_id=preset_id)
    if not preset_config:
        raise DoesNotExist("Пресет не найден")
    return preset_config.preset_config
