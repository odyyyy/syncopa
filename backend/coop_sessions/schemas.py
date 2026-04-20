from enum import StrEnum
from typing import Union

from pydantic.types import UUID4

from projects_management.schemas import ProjectMember
from shared.base_schema import BaseSchema


class CoopSession(BaseSchema):
    project_id: UUID4
    members: list[UUID4]
    changes: list["ProjectChanges"]


class ProjectChanges(BaseSchema):
    id: int
    operation: "SyncOperation"
    subject: "Subject"
    payload: dict


class SyncOperation(StrEnum):
    MOVE = "move"
    CREATE = "create"
    DELETE = "delete"
    UPDATE = "update"


class Subject(StrEnum):
    TRACK = "track"
    NOTE = "note"
    PRESET = "preset"


class ConnectionState(StrEnum):
    INIT = "init"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"


class MemberConnectionInfo(BaseSchema):
    event: ConnectionState
    member: ProjectMember | list[ProjectMember]
