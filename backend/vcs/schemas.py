from datetime import datetime

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


class BranchesWithVersionsMetadata(BaseSchema):
    branches: list[str]
    versions: dict[str, list["VersionMetadata"]]


class BranchCreateIn(BaseSchema):
    branch_title: str
    project_snapshot: ProjectPayload

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


class BranchCreateOut(BaseSchema):
    branch_title: str
    initial_version: VersionMetadata
