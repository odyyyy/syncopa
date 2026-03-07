from daw.schemas import ProjectPayload
from projects_management.models.projects import Projects


async def update_project_payload(
    project_with_payload: Projects, new_project_payload: ProjectPayload
):
    project_with_payload.project_payload = new_project_payload
    await project_with_payload.save()
