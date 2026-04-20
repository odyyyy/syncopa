from fastapi import APIRouter, Depends, Query
from tortoise.exceptions import DoesNotExist

from auth.config import auth
from daw.models import Presets, ProjectsPayloads
from daw.models.presets import PresetsConfigs
from daw.schemas import ProjectPayload, ProjectWithPayload
from daw.schemas.preset import PresetConfig
from daw.services import get_used_presets_with_config, update_project_payload
from projects_management.models.projects import Projects
from projects_management.permissions import require_project_member_or_owner_permission
from projects_management.services import serialize_project_users
from shared.dependencies import AccessTokenRequiredPayload

daw_router = APIRouter(
    prefix="/daw", tags=["daw"], dependencies=[Depends(auth.access_token_required)]
)


@daw_router.get("/payload/{project_id}", response_model=ProjectWithPayload)
async def get_daw_project_with_payload(
    user_payload: AccessTokenRequiredPayload,
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    project = project_with_payload.project
    await project.fetch_related("owner")

    return ProjectWithPayload(
        project_id=project.id,
        owner_id=project.owner.id,
        title=project.title,
        payload=project_with_payload.project_payload,
        invited_members=await serialize_project_users(
            project, user_payload.sub
        ),
    )


@daw_router.put("/payload/{project_id}")
async def update_daw_project_payload(
    new_project_payload: ProjectPayload,
    project_with_payload: Projects = Depends(
        require_project_member_or_owner_permission
    ),
):
    project_payload = await update_project_payload(
        project_with_payload, new_project_payload
    )
    return project_payload


@daw_router.get("/presets")
async def get_presets(presets: list[int] | None = Query(None)):
    if presets:
        return await get_used_presets_with_config(presets)
    else:
        return await Presets.all()


@daw_router.get("/presets/{preset_id}", response_model=PresetConfig)
async def get_preset_config_by_id(preset_id: int):
    preset_config = await PresetsConfigs.get_or_none(preset_id=preset_id)
    if not preset_config:
        raise DoesNotExist("Пресет не найден")
    return preset_config.preset_config
