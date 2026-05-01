
from tortoise import fields
from tortoise.models import Model

from users.models import Users


class Projects(Model):
    id = fields.UUIDField(primary_key=True)
    title = fields.CharField(max_length=30)
    owner = fields.ForeignKeyField(
        to=Users, related_name="projects", on_delete=fields.CASCADE
    )
    members = fields.ManyToManyField(
        to=Users,
        related_name="project_members",
        null=True,
        on_delete=fields.OnDelete.CASCADE,
    )

    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        table = "projects"

    class PydanticMeta:
        exclude = []


