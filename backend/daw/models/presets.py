from enum import Enum

from tortoise import Model, fields

from users.models import Users


class PresetsCategories(str, Enum):
    LEAD = "lead"
    TUBE = "tube"
    GUITAR = "guitar"
    DRUM = "drum"
    KEYS = "keys"
    OTHER = "other"


class Presets(Model):
    title = fields.CharField(max_length=30, unique=True, db_index=True)
    description = fields.CharField(max_length=50, null=True)
    category = fields.CharEnumField(PresetsCategories)
    preview_sound = fields.CharField(max_length=255, null=True)

    class Meta:
        table = "presets"


class PresetsConfigs(Model):
    preset = fields.OneToOneField(to=Presets, related_name="preset_config")
    preset_config = fields.JSONField()

    class Meta:
        table = "presets_configs"


class UsersCustomPresets(Model):
    user = fields.ForeignKeyField(to=Users, related_name="custom_presets")
    title = fields.CharField(max_length=30)
    preset_config = fields.JSONField()

    class Meta:
        table = "users_customs_presets"
