from tortoise import timezone
from tortoise.signals import post_save

from projects_management.models import ProjectsPayloads


@post_save(ProjectsPayloads)
async def update_project_modified(sender, instance, created, using_db, **kwargs):
    """Update field modified_at when project payload changed"""
    if not created:
        instance.project.modified_at = timezone.now()
        await instance.project.save(update_fields=["modified_at"])
