from tortoise import migrations
from tortoise.migrations import operations as ops
import datetime
import functools
from json import dumps, loads
from projects_management.models import InvitationStatus
from tortoise.fields.base import OnDelete
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('models', '0002_add_avatar_role_fields_in_users_table_20260222_0443')]

    initial = False

    operations = [
        ops.CreateModel(
            name='Projects',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('title', fields.CharField(max_length=30)),
                ('owner', fields.ForeignKeyField('models.Users', source_field='owner_id', db_constraint=True, to_field='id', related_name='projects', on_delete=OnDelete.CASCADE)),
                ('invited_members', fields.ManyToManyField('models.Users', null=True, unique=True, db_constraint=True, through='projects_users', forward_key='users_id', backward_key='projects_id', related_name='project_members', on_delete=OnDelete.CASCADE)),
                ('created_at', fields.DatetimeField(auto_now=False, auto_now_add=True)),
                ('modified_at', fields.DatetimeField(auto_now=False, auto_now_add=False)),
            ],
            options={'table': 'projects', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='Invitations',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('project', fields.ForeignKeyField('models.Projects', source_field='project_id', db_constraint=True, to_field='id', related_name='invitations', on_delete=OnDelete.CASCADE)),
                ('from_user', fields.ForeignKeyField('models.Users', source_field='from_user_id', db_constraint=True, to_field='id', related_name='sent_invitations', on_delete=OnDelete.CASCADE)),
                ('to_user', fields.ForeignKeyField('models.Users', source_field='to_user_id', db_constraint=True, to_field='id', related_name='received_invitations', on_delete=OnDelete.CASCADE)),
                ('status', fields.CharEnumField(default='pending', description='PENDING: pending\nACCEPTED: accepted\nREJECTED: rejected', enum_type=InvitationStatus, max_length=8)),
                ('expires', fields.DatetimeField(default=datetime.datetime.fromisoformat('2026-03-26T17:21:07.016503+00:00'), auto_now=False, auto_now_add=False)),
            ],
            options={'table': 'invitations', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='ProjectsPayloads',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('project', fields.OneToOneField('models.Projects', source_field='project_id', db_constraint=True, to_field='id', related_name='project_payload', on_delete=OnDelete.CASCADE)),
                ('project_payload', fields.JSONField(null=True, encoder=functools.partial(dumps, separators=(',', ':')), decoder=loads)),
            ],
            options={'table': 'projects_payloads', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
    ]
