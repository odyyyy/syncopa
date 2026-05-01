from collections import defaultdict

from tortoise import Tortoise

from daw.schemas.project_payload import ProjectPayload
from projects_management.models.projects import Projects
from users.services import get_user_by_id
from vcs.models import Branches, ProjectsVersions
from vcs.schemas import (
    BranchCreateOut,
    BranchesWithVersionsMetadata,
    Snapshot,
    VersionMetadata,
)


async def get_db_connection():
    return Tortoise.get_connection("default")


async def get_project_branches_with_versions_metadata(
    project: Projects,
) -> BranchesWithVersionsMetadata:
    branches = (
        await Branches.filter(project=project)
        .select_related("head_version", "head_version__created_by")
        .order_by("title")
    )

    branches_titles = [branch.title for branch in branches]
    conn = await get_db_connection()

    branches_versions = {}

    project_history: list[dict] = await conn.execute_query_dict(
        """
            WITH RECURSIVE project_history AS (

                SELECT
                    b.title AS branch,
                    pv.id,
                    pv.message,
                    u.username,
                    pvp.parent_id,
                    pv.created_at
                FROM projects_branches b
                JOIN projects_versions pv ON pv.id = b.head_version_id
                JOIN users u ON u.id = pv.created_by_id
                LEFT JOIN projects_versions_parents pvp ON pvp.child_id = pv.id

                UNION ALL

                SELECT
                    ph.branch,
                    pv.id,
                    pv.message,
                    u.username,
                    pvp.parent_id,
                    pv.created_at
                FROM project_history ph
                JOIN projects_versions_parents pvp ON pvp.child_id = ph.parent_id
                JOIN projects_versions pv ON pv.id = pvp.parent_id
                JOIN users u ON u.id = pv.created_by_id
            )

            SELECT distinct * FROM project_history
            ORDER BY branch, created_at;
            """,
    )

    print(project_history)

    if len(project_history) == 0:
        return BranchesWithVersionsMetadata(
            branches=branches_titles,
            versions=branches_versions,
        )
    branches_versions = defaultdict(list)

    for version in project_history:
        branches_versions[version["branch"]].append(
            VersionMetadata(
                id=str(version["id"]),
                message=version["message"],
                creator_username=version["username"],
                created_at=version["created_at"],
            )
        )

    return BranchesWithVersionsMetadata(
        branches=branches_titles,
        versions=branches_versions,
    )


async def create_new_project_branch(
    project: Projects,
    user_id: str,
    base_project_version: ProjectPayload,
    branch_title: str,
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
    return BranchCreateOut(
        branch_title=branch_title,
        initial_version=VersionMetadata(
            id=str(base_version.id),
            message=initial_version_message,
            creator_username=user.username,
            created_at=base_version.created_at,
        ),
    )
