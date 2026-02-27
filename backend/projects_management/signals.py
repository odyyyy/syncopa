from tortoise import BaseDBAsyncClient, timezone
from tortoise.signals import post_save

from projects_management.models import ProjectsPayloads
from projects_management.models.projects import Projects


@post_save(ProjectsPayloads)
async def update_project_modified(
    sender,
    instance: ProjectsPayloads,
    created: bool,
    using_db: BaseDBAsyncClient | None,
    *args,
    **kwargs,
):
    """Update field modified_at when project payload changed"""
    if not created:
        instance.project.modified_at = timezone.now()
        await instance.project.save(update_fields=["modified_at"])


@post_save(Projects)
async def create_project_payload_instance_on_project_creation(
    sender,
    instance: ProjectsPayloads,
    created: bool,
    using_db: BaseDBAsyncClient | None,
    updated_fields,
    *args,
    **kwargs,
):
    """Create related project payload instance on project creation"""
    if created:
        await ProjectsPayloads.create(project=instance)
