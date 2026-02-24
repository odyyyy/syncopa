from tortoise.contrib.pydantic import pydantic_model_creator

from projects_management.models import Projects
from shared.base_schema import BaseSchema

ProjectOut = pydantic_model_creator(
    Projects, name="ProjectOut", model_config=BaseSchema.model_config
)

ProjectIn = pydantic_model_creator(
    Projects,
    name="ProjectIn",
    model_config=BaseSchema.model_config,
    exclude=("created_at", "modified_at"),
    exclude_readonly=True,
)
