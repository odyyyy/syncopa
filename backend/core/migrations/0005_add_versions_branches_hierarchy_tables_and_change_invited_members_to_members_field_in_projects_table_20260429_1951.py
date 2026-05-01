from tortoise import migrations
from tortoise.migrations import operations as ops
import functools
from daw.models.presets import PresetsCategories
from json import dumps, loads
from tortoise.fields.base import OnDelete
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('models', '0004_add_presets_presetsconfig_userscustompresets_tables_20260325_0936')]

    initial = False

    operations = [
        ops.CreateModel(
            name='ProjectsVersions',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('project', fields.ForeignKeyField('models.Projects', source_field='project_id', db_constraint=True, to_field='id', related_name='versions', on_delete=OnDelete.CASCADE)),
                ('created_by', fields.ForeignKeyField('models.Users', source_field='created_by_id', db_constraint=True, to_field='id', related_name='versions', on_delete=OnDelete.CASCADE)),
                ('message', fields.CharField(max_length=80)),
                ('patch', fields.JSONField(encoder=functools.partial(dumps, separators=(',', ':')), decoder=loads)),
                ('created_at', fields.DatetimeField(auto_now=False, auto_now_add=True)),
            ],
            options={'table': 'projects_versions', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='Branches',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('project', fields.ForeignKeyField('models.Projects', source_field='project_id', db_constraint=True, to_field='id', related_name='branches', on_delete=OnDelete.CASCADE)),
                ('head_version', fields.ForeignKeyField('models.ProjectsVersions', source_field='head_version_id', db_constraint=True, to_field='id', related_name='branches', on_delete=OnDelete.CASCADE)),
                ('title', fields.CharField(max_length=30)),
                ('created_at', fields.DatetimeField(auto_now=False, auto_now_add=True)),
                ('modified_at', fields.DatetimeField(auto_now=True, auto_now_add=False)),
            ],
            options={'table': 'projects_branches', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.CreateModel(
            name='ProjectsVersionsParents',
            fields=[
                ('id', fields.UUIDField(primary_key=True, default=uuid4, unique=True, db_index=True)),
                ('parent', fields.ForeignKeyField('models.ProjectsVersions', source_field='parent_id', db_constraint=True, to_field='id', related_name='children', on_delete=OnDelete.CASCADE)),
                ('child', fields.ForeignKeyField('models.ProjectsVersions', source_field='child_id', db_constraint=True, to_field='id', related_name='parents', on_delete=OnDelete.CASCADE)),
            ],
            options={'table': 'projects_versions_parents', 'app': 'models', 'pk_attr': 'id'},
            bases=['Model'],
        ),
        ops.AlterField(
            model_name='Presets',
            name='category',
            field=fields.CharEnumField(description='LEAD: lead\nTUBE: tube\nGUITAR: guitar\nDRUM: drum\nKEYS: keys\nOTHER: other', enum_type=PresetsCategories, max_length=6),
        ),
    ]
