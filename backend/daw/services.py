from tortoise.exceptions import DoesNotExist

from daw.models.presets import PresetsConfigs
from daw.schemas import ProjectPayload
from projects_management.models.projects import Projects


async def update_project_payload(
    project_with_payload: Projects, new_project_payload: ProjectPayload
):
    project_with_payload.project_payload = new_project_payload
    await project_with_payload.save()


async def get_presets_with_config_used_in_project(used_presets: list[str]):
    presets = await PresetsConfigs.filter(
        preset__title__in=used_presets
    ).select_related("project")
    if not presets:
        raise DoesNotExist("Использованные в проекте пресеты не найдены")

    return presets
