from datetime import datetime
from typing import Any

from pydantic import field_validator

from coop_sessions.schemas import ProjectChanges
from daw.schemas.project_payload import ProjectPayload
from shared.base_schema import BaseSchema


class Snapshot(BaseSchema):
    type: str = "snapshot"
    snapshot: ProjectPayload


class Patch(BaseSchema):
    type: str = "patch"
    changes: list["ProjectChanges"]


class VersionWithPatch(BaseSchema):
    type: str = "patch"
    initial_version: ProjectPayload
    patch: list["ProjectChanges"]


class BranchesWithVersionsMetadata(BaseSchema):
    branches: list[str]
    versions: dict[str, list["VersionMetadata"]]


class BranchCreateIn(BaseSchema):
    branch_title: str
    project_snapshot: ProjectPayload
    parent_version_id: str | None = None

    @field_validator("branch_title", mode="before")
    @classmethod
    def validate_branch_title(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("Название ветки должно содержать минимум 3 символа")
        if len(v) > 30:
            raise ValueError("Название ветки не может превышать 30 символов")
        return v


class VersionMetadata(BaseSchema):
    id: str
    message: str
    creator_username: str
    created_at: datetime
    is_head: bool
    parents_ids: list[str] | None = None


class BranchCreateOut(BaseSchema):
    branch_title: str
    initial_version: VersionMetadata


class VersionCreateOut(BaseSchema):
    version_metadata: VersionMetadata
    branch_title: str


class VersionCreateIn(BaseSchema):
    patch: Patch
    version_message: str


class MergeRequestIn(BaseSchema):
    source_branch: str
    target_branch: str


class ConflictDetail(BaseSchema):
    type: str
    entity_id: str
    source_value: Any | None = None
    target_value: Any | None = None


class MergeResultOut(BaseSchema):
    operations: list[ProjectChanges] = []
    conflicts: list[ConflictDetail] = []
    merged_version_id: str | None = None

