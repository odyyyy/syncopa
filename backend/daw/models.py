from tortoise import Model, fields

from projects_management.models.projects import Projects


class ProjectsPayloads(Model):
    project = fields.OneToOneField(to=Projects, related_name="project_payload")
    project_payload = fields.JSONField(default=None, null=True)

    def __str__(self):
        return self.project

    class Meta:
        table = "projects_payloads"
