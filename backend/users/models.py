from tortoise import fields
from tortoise.models import Model


class Users(Model):
    id = fields.UUIDField(primary_key=True)
    username = fields.CharField(max_length=30, unique=True)
    email = fields.CharField(max_length=255,unique=True)
    password_hash = fields.CharField(max_length=255)

    # role = fields.CharEnumField()
    is_active = fields.BooleanField(default=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    def __str__(self):
        return self.username

    class Meta:
        table = "users"

    class PydanticMeta:
        exclude = ["password_hash"]
