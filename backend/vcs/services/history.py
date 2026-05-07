from collections import defaultdict

from projects_management.models.projects import Projects
from vcs.models import Branches
from vcs.schemas import (
    BranchesWithVersionsMetadata,
    VersionMetadata,
)

from .shared import _get_db_connection


async def get_project_branches_with_versions_metadata(
    project: Projects,
) -> BranchesWithVersionsMetadata:
    branches = (
        await Branches.filter(project=project)
        .select_related("head_version", "head_version__created_by")
        .order_by("title")
    )

    branches_titles = [branch.title for branch in branches]
    conn = await _get_db_connection()

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
            WHERE b.project_id = $1

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
            WHERE pv.project_id = $1
              AND pv.id NOT IN (
                  SELECT head_version_id FROM projects_branches WHERE project_id = $1
              )
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
        """,
        [str(project.id)],
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
