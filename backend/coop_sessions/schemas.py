from enum import StrEnum

from pydantic.types import UUID4

from projects_management.schemas import ProjectMember
from shared.base_schema import BaseSchema


class CoopSession(BaseSchema):
    project_id: UUID4
    members: list[UUID4]
    changes: list["ProjectChanges"]


class ProjectChanges(BaseSchema):
    operation: "SyncOperation"
    target: "Target"
    payload: dict
    timestamp: int


class SyncOperation(StrEnum):
    TRANSFORM = "transform"
    CREATE = "create"
    REMOVE = "remove"
    UPDATE = "update"


class Target(StrEnum):
    TRACK = "track"
    PATTERN = "pattern"
    NOTE = "note"
    PRESET = "preset"
    TRACK_VOLUME = "track_volume"


class ConnectionState(StrEnum):
    INIT = "init"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"


class MemberConnectionInfo(BaseSchema):
    event: ConnectionState
    member: ProjectMember | list[ProjectMember]
