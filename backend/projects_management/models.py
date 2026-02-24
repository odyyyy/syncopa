from datetime import timedelta
from enum import Enum

from tortoise import fields, timezone
from tortoise.models import Model

from users.models import Users


class Projects(Model):
    id = fields.UUIDField(primary_key=True)
    title = fields.CharField(max_length=30)
    owner = fields.ForeignKeyField(
        to=Users, related_name="projects", on_delete=fields.CASCADE
    )
    invited_members = fields.ManyToManyField(
        to=Users,
        related_name="project_members",
        null=True,
        on_delete=fields.OnDelete.CASCADE,
    )

    # genre, bpm, metadata
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField()

    def __str__(self):
        return self.title

    class Meta:
        table = "projects"

    class PydanticMeta:
        exclude = []


class ProjectsPayloads(Model):
    project = fields.OneToOneField(
        to=Projects, related_name="project_payload"
    )
    project_payload = fields.JSONField(default=None, null=True)

    def __str__(self):
        return self.project

    class Meta:
        table = "projects_payloads"


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
