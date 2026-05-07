
from tortoise import transactions
from tortoise.exceptions import DoesNotExist

from daw.schemas.project_payload import ProjectPayload
from projects_management.models.projects import Projects
from users.services import get_user_by_id
from vcs.models import Branches, ProjectsVersions, ProjectsVersionsParents
from vcs.schemas import (
    BranchCreateOut,
    Snapshot,
    VersionMetadata,
)


@transactions.atomic()
async def create_new_project_branch(
    project: Projects,
    user_id: str,
    base_project_version: ProjectPayload,
    branch_title: str,
    parent_version_id: str | None,
) -> BranchCreateOut:
    user = await get_user_by_id(user_id)

    if await Branches.filter(title=branch_title, project=project).exists():
        raise ValueError(f"Ветка с названием {branch_title} уже существует в проекте!")

    if await Branches.filter(project=project).count() >= 10:
        raise ValueError("В проекте не может быть более 10 веток!")

    initial_version_message = f"Начальная версия ветки {branch_title}"

    base_version = await ProjectsVersions.create(
        project=project,
        created_by=user,
        message=initial_version_message,
        patch=Snapshot(type="snapshot", snapshot=base_project_version).model_dump(),
    )

    await Branches.create(
        project=project,
        title=branch_title,
        head_version=base_version,
    )

    if parent_version_id:
        await ProjectsVersionsParents.create(
            child_id=base_version.id,
            parent_id=parent_version_id,
        )
    else:
        await ProjectsVersionsParents.create(
            child_id=base_version.id,
            parent_id=None,
        )

    return BranchCreateOut(
        branch_title=branch_title,
        initial_version=VersionMetadata(
            id=str(base_version.id),
            message=initial_version_message,
            creator_username=user.username,
            created_at=base_version.created_at,
            is_head=True,
        ),
    )


async def get_branch_by_title(project: Projects, branch_title: str) -> Branches:
    branch = await Branches.get_or_none(
        title=branch_title, project=project
    ).select_related("head_version")
    if not branch:
        raise DoesNotExist("Выбранная ветка не найдена")
    return branch
