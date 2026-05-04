from tortoise import migrations
from tortoise.migrations import operations as ops
from tortoise.fields.base import OnDelete
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('models', '0005_add_versions_branches_hierarchy_tables_and_change_invited_members_to_members_field_in_projects_table_20260429_1951')]

    initial = False

    operations = [
        ops.AlterField(
            model_name='Branches',
            name='head_version',
            field=fields.ForeignKeyField('models.ProjectsVersions', source_field='head_version_id', db_index=True, db_constraint=True, to_field='id', related_name='branches', on_delete=OnDelete.CASCADE),
        ),
        ops.AlterField(
            model_name='ProjectsVersionsParents',
            name='child',
            field=fields.ForeignKeyField('models.ProjectsVersions', source_field='child_id', null=True, db_index=True, db_constraint=True, to_field='id', related_name='parents', on_delete=OnDelete.CASCADE),
        ),
        ops.AlterField(
            model_name='ProjectsVersionsParents',
            name='parent',
            field=fields.ForeignKeyField('models.ProjectsVersions', source_field='parent_id', null=True, db_index=True, db_constraint=True, to_field='id', related_name='children', on_delete=OnDelete.CASCADE),
        ),
    ]
