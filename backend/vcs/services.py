import json
from collections import defaultdict

from pydantic import UUID4
from tortoise import Tortoise, transactions
from tortoise.exceptions import DoesNotExist

from daw.schemas.project_payload import ProjectPayload
from projects_management.models.projects import Projects
from users.services import get_user_by_id
from vcs.models import Branches, ProjectsVersions, ProjectsVersionsParents
from vcs.schemas import (
    BranchCreateOut,
    BranchesWithVersionsMetadata,
    Snapshot,
    VersionCreateIn,
    VersionCreateOut,
    VersionMetadata,
    VersionWithPatch,
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
        WITH RECURSIVE project_history_recursive AS (
            SELECT
                b.title AS branch,
                pv.id,
                pv.message,
                u.username,
                pvp.parent_id,
                pv.created_at,
                TRUE AS is_head
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
                pvp_next.parent_id,
                pv.created_at,
                FALSE AS is_head
            FROM project_history_recursive ph
            JOIN projects_versions pv ON pv.id = ph.parent_id
            JOIN users u ON u.id = pv.created_by_id
            LEFT JOIN projects_versions_parents pvp_next ON pvp_next.child_id = pv.id
        )
        SELECT
            branch,
            id,
            message,
            username,
            created_at,
            is_head,
            ARRAY_AGG(parent_id) FILTER (WHERE parent_id IS NOT NULL) AS parent_ids
        FROM project_history_recursive
        GROUP BY branch, id, message, username, created_at, is_head
        ORDER BY branch, created_at DESC;
        """
    )

    if not project_history:
        return BranchesWithVersionsMetadata(
            branches=branches_titles,
            versions=defaultdict(list),
        )

    branches_versions = defaultdict(list)

    for version in project_history:
        parents = (
            [str(p) for p in version["parent_ids"]] if version["parent_ids"] else []
        )

        branches_versions[version["branch"]].append(
            VersionMetadata(
                id=str(version["id"]),
                message=version["message"],
                creator_username=version["username"],
                created_at=version["created_at"],
                is_head=version["is_head"],
                parents_ids=parents,
            )
        )

    return BranchesWithVersionsMetadata(
        branches=branches_titles,
        versions=branches_versions,
    )


@transactions.atomic()
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


async def get_project_version_by_id(
    project: Projects, version_id: UUID4
) -> ProjectsVersions:
    version = await ProjectsVersions.get_or_none(id=version_id, project=project)
    if not version:
        raise DoesNotExist("Версия не найдена")
    return version


async def get_version_payload(version_id: UUID4, project: Projects, branch_title: str):
    version = await get_project_version_by_id(project, version_id)
    branch = await get_branch_by_title(project, branch_title)

    if version.patch["type"] == "snapshot":
        return Snapshot(snapshot=version.patch["snapshot"])
    elif version.patch["type"] == "patch":
        conn = await get_db_connection()

        history_rows: list[dict] = await conn.execute_query_dict(
            """
            WITH RECURSIVE project_history AS (
                SELECT
                    pv.id,
                    pvp.parent_id,
                    pv.patch,
                    pv.created_at
                FROM projects_branches b
                JOIN projects_versions pv ON pv.id = b.head_version_id
                LEFT JOIN projects_versions_parents pvp ON pvp.child_id = pv.id
                WHERE b.title = $1

                UNION ALL

                SELECT
                    pv.id,
                    pvp_next.parent_id,
                    pv.patch,
                    pv.created_at
                FROM project_history ph
                JOIN projects_versions pv ON pv.id = ph.parent_id
                LEFT JOIN projects_versions_parents pvp_next ON pvp_next.child_id = pv.id
            )
            SELECT patch FROM project_history
            ORDER BY created_at ASC;
            """,
            [branch.title],
        )

        if not history_rows:
            raise DoesNotExist("История версий не найдена")

        rows_iter = iter(history_rows)

        first_row = next(rows_iter)
        initial_patch = (
            json.loads(first_row["patch"])
            if isinstance(first_row["patch"], str)
            else first_row["patch"]
        )

        if not initial_patch.get("snapshot"):
            raise DoesNotExist("Первичная версия не найдена в начале ветки")

        all_versions_changes = [
            change
            for row in rows_iter
            for p in [
                json.loads(row["patch"])
                if isinstance(row["patch"], str)
                else row["patch"]
            ]
            if p.get("type") == "patch"
            for change in p.get("changes", [])
        ]

        return VersionWithPatch(
            initial_version=initial_patch["snapshot"],
            patch=all_versions_changes,
        )
    else:
        raise ValueError("Неверный тип изменений")


@transactions.atomic()
async def create_version(
    project: Projects, branch_title: str, payload: VersionCreateIn, user_id: str
):
    branch = await get_branch_by_title(project, branch_title)

    conn = await get_db_connection()

    previous_version_on_branch: list[dict] = await conn.execute_query_dict(
        """
                WITH RECURSIVE project_history AS (
                    SELECT
                        pv.id as version_id,
                        pvp.id as relation_id,
                        pvp.parent_id,
                        pv.created_at
                    FROM projects_branches b
                    JOIN projects_versions pv ON pv.id = b.head_version_id
                    LEFT JOIN projects_versions_parents pvp ON pvp.child_id = pv.id
                    WHERE b.title = $1

                    UNION ALL

                    SELECT
                        pv.id as version_id,
                        pvp.id as relation_id,
                        pvp.parent_id,
                        pv.created_at
                    FROM project_history ph
                    JOIN projects_versions_parents pvp ON pvp.child_id = ph.parent_id
                    JOIN projects_versions pv ON pv.id = pvp.parent_id
                )

                SELECT version_id, relation_id
                FROM project_history
                ORDER BY created_at DESC
                LIMIT 1;
                """,
        [branch.title],
    )

    if (
        not previous_version_on_branch
        or len(previous_version_on_branch) == 0
        or not previous_version_on_branch[0].get("version_id", None)
    ):
        raise DoesNotExist("Предыдущая версия проекта не найдена")

    version_id = previous_version_on_branch[0].get("version_id")
    if version_id != branch.head_version.id:
        raise DoesNotExist("Указатель не находится на последней версии в ветке")

    user = await get_user_by_id(user_id)
    new_version = await ProjectsVersions.create(
        project=project,
        branch=branch,
        patch=payload.patch,
        created_by=user,
        message=payload.version_message,
    )

    await ProjectsVersionsParents.create(
        child_id=new_version.id,
        parent_id=version_id,
    )

    branch.head_version = new_version
    await branch.save()

    return VersionCreateOut(
        version_metadata=VersionMetadata(
            id=str(new_version.id),
            message=new_version.message,
            creator_username=new_version.created_by.username,
            created_at=new_version.created_at,
            is_head=True,
        ),
        branch_title=branch.title,
    )
