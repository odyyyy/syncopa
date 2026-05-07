import json

from pydantic import UUID4
from tortoise import transactions
from tortoise.exceptions import DoesNotExist

from projects_management.models.projects import Projects
from users.services import get_user_by_id
from vcs.models import ProjectsVersions, ProjectsVersionsParents
from vcs.schemas import (
    Snapshot,
    VersionCreateIn,
    VersionCreateOut,
    VersionMetadata,
    VersionWithPatch,
)
from vcs.services.branches import get_branch_by_title

from .shared import _get_db_connection


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
        conn = await _get_db_connection()

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
                WHERE b.title = $1 AND pv.project_id = $2

                UNION ALL

                SELECT
                    pv.id,
                    pvp_next.parent_id,
                    pv.patch,
                    pv.created_at
                FROM project_history ph
                JOIN projects_versions pv ON pv.id = ph.parent_id
                LEFT JOIN projects_versions_parents pvp_next ON pvp_next.child_id = pv.id
                WHERE pv.project_id = $2
            )
            SELECT patch FROM project_history
            ORDER BY created_at ASC;
            """,
            [branch.title, project.id],
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

    conn = await _get_db_connection()

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
                    WHERE b.title = $1 AND pv.project_id = $2

                    UNION ALL

                    SELECT
                        pv.id as version_id,
                        pvp.id as relation_id,
                        pvp.parent_id,
                        pv.created_at
                    FROM project_history ph
                    JOIN projects_versions_parents pvp ON pvp.child_id = ph.parent_id
                    JOIN projects_versions pv ON pv.id = pvp.parent_id
                    WHERE pv.project_id = $2
                )

                SELECT version_id, relation_id
                FROM project_history
                ORDER BY created_at DESC
                LIMIT 1;
                """,
        [branch.title, project.id],
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
