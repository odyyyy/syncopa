from tortoise import migrations
from tortoise.migrations import operations as ops
from users.models import Role
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('models', '0001_initial')]

    initial = False

    operations = [
        ops.AddField(
            model_name='Users',
            name='avatar',
            field=fields.CharField(null=True, max_length=512),
        ),
        ops.AddField(
            model_name='Users',
            name='role',
            field=fields.CharEnumField(default='user', description='USER: user\nADMIN: admin', enum_type=Role, max_length=5),
        ),
    ]
