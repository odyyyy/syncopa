import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from starlette.responses import FileResponse

from core.settings import get_settings
from daw.models.presets import PresetsConfigs
from daw.models.projects_payloads import ProjectsPayloads
from daw.schemas import ProjectPayload
from daw.schemas.preset import PresetConfig
from shared.services import save_file


async def update_project_payload(
    project_with_payload: ProjectsPayloads, new_project_payload: ProjectPayload
):
    project_with_payload.project_payload = new_project_payload
    await project_with_payload.save()


async def get_used_presets_with_config(used_presets_ids: list[int]):
    presets = await PresetsConfigs.filter(
        preset__id__in=used_presets_ids
    ).select_related("preset")

    presets_map = {
        p.preset.id: PresetConfig.model_validate(p.preset_config) for p in presets
    }

    return presets_map


def get_audio_file(project_id: str, audio_id: str):
    base_dir = get_settings().BASE_DAW_DIR / project_id

    for ext in [".wav", ".mp3", ".ogg"]:
        path = base_dir / f"{audio_id}{ext}"

        if path.exists():
            return FileResponse(
                path,
                media_type=_get_mime_type(ext),
                filename=path.name,
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Аудио файл не найден"
    )


def _get_mime_type(ext: str) -> str:
    if ext == ".wav":
        return "audio/wav"
    if ext == ".mp3":
        return "audio/mpeg"
    if ext == ".ogg":
        return "audio/ogg"
    return "application/octet-stream"


async def save_audio_pattern(audio: UploadFile | None, project_id: str):
    validate_audio_file(audio)
    assert audio is not None

    audio_file_id = str(uuid.uuid4())
    audio_extension = get_audio_extension_by_mimetype(audio)
    path_audio_file = (
        get_settings().BASE_DAW_DIR / project_id / f"{audio_file_id}{audio_extension}"
    )
    await save_file(audio, Path(path_audio_file))

    return audio_file_id


supported_audio_extensions = {
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
}


def validate_audio_file(audio: UploadFile | None):
    if audio is None:
        return

    if audio.size is None:
        raise ValueError("Размер файла неизвестен")

    if audio.size > 1024 * 1024 * 5:
        raise ValueError("Размер файла не должен превышать 5 Мб")

    if audio.content_type not in supported_audio_extensions.keys():
        raise ValueError("Файл должен быть аудио (MP3, WAV, OGG, FLAC)")


def get_audio_extension_by_mimetype(audio: UploadFile) -> str:
    if audio.filename is not None:
        return Path(audio.filename).suffix

    elif audio.content_type is not None:
        return supported_audio_extensions.get(audio.content_type, "")

    else:
        raise ValueError("Не удалось определить расширение аудиофайла")
