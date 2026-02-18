from tortoise import migrations
from tortoise.migrations import operations as ops
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    initial = True

    operations = [
        ops.CreateModel(
            name='Users',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('username', fields.CharField(unique=True, max_length=30)),
                ('email', fields.CharField(unique=True, max_length=255)),
                ('password_hash', fields.CharField(max_length=255)),
                ('is_active', fields.BooleanField(default=True)),
                ('created_at', fields.DatetimeField(auto_now=False, auto_now_add=True)),
                ('modified_at', fields.DatetimeField(auto_now=True, auto_now_add=False)),
            ],
            options={'table': 'users', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
    ]
