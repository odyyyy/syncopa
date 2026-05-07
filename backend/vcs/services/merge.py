import json
import uuid

from pydantic import UUID4
from tortoise import transactions
from tortoise.exceptions import DoesNotExist

from coop_sessions.schemas import ProjectChanges
from projects_management.models.projects import Projects
from users.services import get_user_by_id
from vcs.models import Branches, ProjectsVersions, ProjectsVersionsParents
from vcs.schemas import ConflictDetail, MergeResultOut

from .shared import _get_db_connection


@transactions.atomic()
async def merge_branches(
    project: Projects,
    source_title: str,
    target_title: str,
    user_id: str,
) -> MergeResultOut:
    source_branch = await Branches.get_or_none(
        title=source_title, project=project
    ).select_related("head_version")
    target_branch = await Branches.get_or_none(
        title=target_title, project=project
    ).select_related("head_version")

    if not source_branch:
        raise DoesNotExist(f"Ветка '{source_title}' не найдена")
    if not target_branch:
        raise DoesNotExist(f"Ветка '{target_title}' не найдена")

    source_head_id = source_branch.head_version.id
    target_head_id = target_branch.head_version.id

    user = await get_user_by_id(user_id)

    lca_id = await _find_lca(source_head_id, target_head_id, project.id)
    if lca_id is None:
        raise ValueError(
            f"Невозможно слить ветки '{source_title}' и '{target_title}': "
            "у них нет общего предка. Ветка была создана без привязки к истории проекта."
        )

    if lca_id == source_head_id:
        return MergeResultOut(
            operations=[],
            conflicts=[],
            merged_version_id=str(target_head_id),
        )

    source_ops = await _get_operations_after(source_branch, lca_id, project.id)
    target_ops = await _get_operations_after(target_branch, lca_id, project.id)

    merged_ops, conflicts = _merge_operations(source_ops, target_ops)

    if conflicts:
        return MergeResultOut(
            operations=merged_ops,
            conflicts=conflicts,
            merged_version_id=None,
        )

    if not merged_ops:
        return MergeResultOut(
            operations=[],
            conflicts=[],
            merged_version_id=str(target_head_id),
        )

    new_version = await ProjectsVersions.create(
        project=project,
        created_by=user,
        patch={
            "type": "patch",
            "changes": [op.model_dump() for op in merged_ops],
        },
        message=f"Слияние веток: {source_title} → {target_title}",
    )

    await ProjectsVersionsParents.create(
        child_id=new_version.id,
        parent_id=target_head_id,
    )
    await ProjectsVersionsParents.create(
        child_id=new_version.id,
        parent_id=source_head_id,
    )

    target_branch.head_version = new_version
    await target_branch.save()

    return MergeResultOut(
        operations=merged_ops,
        conflicts=[],
        merged_version_id=str(new_version.id),
    )


async def _find_lca(
    source_head_id: UUID4,
    target_head_id: UUID4,
    project_id: UUID4,
) -> UUID4 | None:
    conn = await _get_db_connection()
    rows = await conn.execute_query_dict(
        """
        WITH RECURSIVE
        ancestors_source AS (
            SELECT $1::uuid AS id
            UNION ALL
            SELECT pvp.parent_id
            FROM projects_versions_parents pvp
            JOIN ancestors_source a ON pvp.child_id = a.id
            JOIN projects_versions pv ON pv.id = pvp.parent_id
            WHERE pvp.parent_id IS NOT NULL AND pv.project_id = $3
        ),
        ancestors_target AS (
            SELECT $2::uuid AS id
            UNION ALL
            SELECT pvp.parent_id
            FROM projects_versions_parents pvp
            JOIN ancestors_target a ON pvp.child_id = a.id
            JOIN projects_versions pv ON pv.id = pvp.parent_id
            WHERE pvp.parent_id IS NOT NULL AND pv.project_id = $3
        )
        SELECT a.id::text
        FROM ancestors_source a
        JOIN ancestors_target b ON a.id = b.id
        JOIN projects_versions pv ON pv.id = a.id
        WHERE pv.project_id = $3
        ORDER BY pv.created_at DESC
        LIMIT 1
        """,
        [source_head_id, target_head_id, project_id],
    )
    return uuid.UUID(rows[0]["id"]) if rows else None


async def _get_operations_after(
    branch: Branches,
    after_version_id: UUID4,
    project_id: uuid.UUID,
) -> list[dict]:
    conn = await _get_db_connection()

    rows = await conn.execute_query_dict(
        """
        WITH RECURSIVE branch_history AS (
            SELECT
                pv.id,
                pvp.parent_id,
                pv.patch,
                pv.created_at
            FROM projects_branches b
            JOIN projects_versions pv ON pv.id = b.head_version_id
            LEFT JOIN projects_versions_parents pvp ON pvp.child_id = pv.id
            WHERE b.id = $1 AND pv.project_id = $2

            UNION ALL

            SELECT
                pv.id,
                pvp_next.parent_id,
                pv.patch,
                pv.created_at
            FROM branch_history bh
            JOIN projects_versions pv ON pv.id = bh.parent_id
            LEFT JOIN projects_versions_parents pvp_next ON pvp_next.child_id = pv.id
            WHERE pv.project_id = $2
        )
        SELECT id::text, patch, created_at
        FROM branch_history
        ORDER BY created_at ASC
        """,
        [branch.id, project_id],
    )

    after_lca = False
    result_ops: list[dict] = []

    for row in rows:
        if not after_lca:
            if str(row["id"]) == str(after_version_id):
                after_lca = True
            continue

        patch = (
            json.loads(row["patch"]) if isinstance(row["patch"], str) else row["patch"]
        )
        if patch.get("type") == "patch":
            result_ops.extend(patch.get("changes", []))

    return result_ops


def _merge_operations(
    source_ops: list[dict],
    target_ops: list[dict],
) -> tuple[list[ProjectChanges], list[ConflictDetail]]:

    def entity_key(op: dict) -> str:
        target = op.get("target", "")
        payload = op.get("payload", {})

        if target == "track":
            entity_id = (
                payload.get("trackId")
                or (payload.get("track") or {}).get("id")
                or "unknown"
            )
        elif target == "pattern":
            entity_id = payload.get("patternId") or "unknown"
        elif target == "note":
            pattern_id = payload.get("patternId", "")
            note_id = (
                payload.get("noteId")
                or (payload.get("note") or {}).get("id")
                or "unknown"
            )
            entity_id = f"{pattern_id}:{note_id}"
        elif target == "preset":
            entity_id = payload.get("trackId") or "unknown"
        elif target == "track_volume":
            entity_id = payload.get("trackId") or "unknown"
        elif target == "effect":
            pattern_id = payload.get("patternId", "")
            effect_type = payload.get("effectType") or (
                payload.get("effectParams") or {}
            ).get("type", "unknown")
            entity_id = f"{pattern_id}:{effect_type}"
        else:
            entity_id = "unknown"

        return f"{target}:{entity_id}"

    source_by_entity: dict[str, dict] = {}
    for op in source_ops:
        source_by_entity[entity_key(op)] = op

    target_by_entity: dict[str, dict] = {}
    for op in target_ops:
        target_by_entity[entity_key(op)] = op

    all_keys = set(source_by_entity) | set(target_by_entity)

    merged: list[ProjectChanges] = []
    conflicts: list[ConflictDetail] = []

    for key in all_keys:
        in_source = key in source_by_entity
        in_target = key in target_by_entity

        if in_source and not in_target:
            merged.append(ProjectChanges(**source_by_entity[key]))

        elif in_target and not in_source:
            pass

        else:
            src_op = source_by_entity[key]
            tgt_op = target_by_entity[key]

            if src_op == tgt_op:
                merged.append(ProjectChanges(**src_op))
            else:
                conflicts.append(
                    ConflictDetail(
                        type=f"{src_op.get('target')}_conflict",
                        entity_id=key,
                        source_value=src_op,
                        target_value=tgt_op,
                    )
                )

    return merged, conflicts
