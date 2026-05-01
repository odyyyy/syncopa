from tortoise import Model, fields

from projects_management.models.projects import Projects
from users.models import Users


class ProjectsVersions(Model):
    id = fields.UUIDField(primary_key=True)
    project = fields.ForeignKeyField(to=Projects, related_name="versions")
    created_by = fields.ForeignKeyField(to=Users, related_name="versions")
    message = fields.CharField(max_length=80)
    patch = fields.JSONField()
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "projects_versions"


class Branches(Model):
    id = fields.UUIDField(primary_key=True)
    project = fields.ForeignKeyField(to=Projects, related_name="branches")
    head_version = fields.ForeignKeyField(to=ProjectsVersions, related_name="branches")
    title = fields.CharField(max_length=30)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "projects_branches"


class ProjectsVersionsParents(Model):
    id = fields.UUIDField(primary_key=True)
    parent = fields.ForeignKeyField(
        to=ProjectsVersions, related_name="children", db_index=True
    )
    child = fields.ForeignKeyField(
        to=ProjectsVersions, related_name="parents", db_index=True
    )

    class Meta:
        table = "projects_versions_parents"
