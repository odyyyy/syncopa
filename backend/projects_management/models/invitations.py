from datetime import timedelta
from enum import Enum

from tortoise import fields, timezone
from tortoise.models import Model

from users.models import Users

from .projects import Projects


class InvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class Invitations(Model):
    id = fields.UUIDField(primary_key=True)
    project = fields.ForeignKeyField(
        to=Projects,
        related_name="invitations",
        on_delete=fields.CASCADE,
    )
    from_user = fields.ForeignKeyField(
        to=Users, related_name="sent_invitations", on_delete=fields.CASCADE
    )
    to_user = fields.ForeignKeyField(
        to=Users, related_name="received_invitations", on_delete=fields.CASCADE
    )
    status = fields.CharEnumField(
        enum_type=InvitationStatus, default=InvitationStatus.PENDING.value
    )
    expires = fields.DatetimeField(default=timezone.now() + timedelta(days=30))

    def __str__(self):
        return f"{self.from_user} invited to {self.to_user} in project {self.project}"

    class Meta:
        table = "invitations"

    class PydanticMeta:
        computed = "expires"
