from daw.models.presets import PresetsConfigs
from daw.schemas import ProjectPayload
from projects_management.models.projects import Projects


async def update_project_payload(
    project_with_payload: Projects, new_project_payload: ProjectPayload
):
    project_with_payload.project_payload = new_project_payload
    await project_with_payload.save()


async def get_used_presets_with_config(used_presets_ids: list[int]):
    presets = await PresetsConfigs.filter(
        preset__id__in=used_presets_ids
    ).select_related("preset")

    presets_map = {p.preset.id: p.preset_config for p in presets}

    return presets_map
