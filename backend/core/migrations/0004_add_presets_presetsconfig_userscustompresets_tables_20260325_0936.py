from tortoise import migrations
from tortoise.migrations import operations as ops
import functools
from daw.models.presets import PresetsCategories
from json import dumps, loads
from tortoise.fields.base import OnDelete
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('models', '0003_add_projects_projectspayload_invitations_tables_20260224_2021')]

    initial = False

    operations = [
        ops.CreateModel(
            name='Presets',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('title', fields.CharField(unique=True, db_index=True, max_length=30)),
                ('description', fields.CharField(null=True, max_length=50)),
                ('category', fields.CharEnumField(description='LEAD: lead\nPADS: pads\nGUITAR: guitar\nDRUM: drum\nKEYS: keys', enum_type=PresetsCategories, max_length=6)),
                ('preview_sound', fields.CharField(null=True, max_length=255)),
            ],
            options={'table': 'presets', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='PresetsConfigs',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('preset', fields.OneToOneField('models.Presets', source_field='preset_id', db_constraint=True, to_field='id', related_name='preset_config', on_delete=OnDelete.CASCADE)),
                ('preset_config', fields.JSONField(encoder=functools.partial(dumps, separators=(',', ':')), decoder=loads)),
            ],
            options={'table': 'presets_configs', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='UsersCustomPresets',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('user', fields.ForeignKeyField('models.Users', source_field='user_id', db_constraint=True, to_field='id', related_name='custom_presets', on_delete=OnDelete.CASCADE)),
                ('title', fields.CharField(max_length=30)),
                ('preset_config', fields.JSONField(encoder=functools.partial(dumps, separators=(',', ':')), decoder=loads)),
            ],
            options={'table': 'users_customs_presets', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.AlterField(
            model_name='Projects',
            name='modified_at',
            field=fields.DatetimeField(auto_now=True, auto_now_add=False),
        ),
    ]
