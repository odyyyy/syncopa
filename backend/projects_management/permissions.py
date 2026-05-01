from fastapi import Depends, HTTPException, status
from pydantic.types import UUID4
from tortoise.expressions import Q

from daw.models import ProjectsPayloads
from projects_management.models.projects import Projects
from users.models import Users
from users.services import get_current_user


async def require_project_owner_permission(
    project_id: UUID4,
    user: Users = Depends(get_current_user),
):
    project = await Projects.get_or_none(
        id=project_id,
        owner_id=user.id,
    ).select_related("owner")

    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ к проекту запрещен",
        )

    return project


async def require_project_member_or_owner_permission(
    project_id: UUID4,
    user: Users = Depends(get_current_user),
) -> ProjectsPayloads:
    project_payload = (
        await ProjectsPayloads.filter(
            Q(project_id=project_id)
            & (Q(project__owner_id=user.id) | Q(project__members__id=user.id))
        )
        .select_related("project__owner")
        .prefetch_related("project__members")
        .first()
    )

    if project_payload is None:
        raise HTTPException(status_code=403, detail="Доступ запрещен")

    return project_payload
