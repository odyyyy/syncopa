from fastapi import APIRouter, Depends, File, Query, UploadFile
from tortoise.exceptions import DoesNotExist

from auth.config import auth
from daw.models import Presets, ProjectsPayloads
from daw.models.presets import PresetsConfigs
from daw.schemas import ProjectPayload, ProjectWithPayload
from daw.schemas.preset import PresetConfig
from daw.schemas.project_payload import PatternAudioOut
from daw.services import (
    get_audio_file,
    get_used_presets_with_config,
    save_audio_pattern,
    update_project_payload,
)
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
        members=await serialize_project_users(project, user_payload.sub),
    )


@daw_router.put("/payload/{project_id}")
async def update_daw_project_payload(
    new_project_payload: ProjectPayload,
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    project_payload = await update_project_payload(
        project_with_payload, new_project_payload
    )
    return project_payload


@daw_router.post("/payload/{project_id}/audio")
async def upload_audio_pattern(
    audio: UploadFile | None = File(None),
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    saved_audio_pattern_id = await save_audio_pattern(
        audio, str(project_with_payload.project.id)
    )
    return PatternAudioOut(pattern_id=saved_audio_pattern_id)


@daw_router.get("/payload/{project_id}/audio/{audio_id}")
async def get_audio_pattern(
    audio_id: str,
    project_with_payload: ProjectsPayloads = Depends(
        require_project_member_or_owner_permission
    ),
):
    return get_audio_file(str(project_with_payload.project.id), audio_id)


@daw_router.get("/presets")
async def get_presets(presets_ids: list[int] = Query(None, alias="ids")):
    if presets_ids:
        return await get_used_presets_with_config(presets_ids)
    else:
        return await Presets.all()


@daw_router.get("/presets/{preset_id}", response_model=PresetConfig)
async def get_preset_config_by_id(preset_id: int):
    preset_config = await PresetsConfigs.get_or_none(preset_id=preset_id)
    if not preset_config:
        raise DoesNotExist("Пресет не найден")
    return preset_config.preset_config
