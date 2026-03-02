import asyncio

from pydantic import UUID4
from tortoise import transactions
from tortoise.exceptions import DoesNotExist

from core.settings import get_settings
from users.models import Users
from users.services import get_user_avatar_base64, get_user_by_id

from .models import Invitations, Projects
from .schemas import ProjectIn, ProjectMember, ProjectOut


@transactions.atomic()
async def create_project_and_invite_members(project_data: ProjectIn, owner_id: str):
    project = await create_project(project_data, owner_id)
    await invite_members(project, project_data.invited_members)
    return project


async def create_project(project_data: ProjectIn, owner_id: str):
    owner = await get_user_by_id(owner_id)
    created_project = await Projects.create(title=project_data.title, owner=owner)
    return created_project


async def get_project_by_id(project_id: UUID4):
    project = await Projects.get_or_none(id=project_id)
    if project is None:
        raise DoesNotExist("Проект не найден")
    return project


async def invite_members(project: Projects, invited_members_usernames: list[str]):
    if (
        invited_members_usernames
        and project.owner.username not in invited_members_usernames
    ):
        members = await Users.filter(username__in=invited_members_usernames)

        invitations_to_create = [
            Invitations(project=project, from_user=project.owner, to_user=member)
            for member in members
        ]
        await Invitations.bulk_create(invitations_to_create)


async def get_user_projects(user_id: str):
    user_projects = (
        await Projects.filter(owner__id=user_id)
        .prefetch_related("invited_members", "owner")
        .order_by("-modified_at")
    )
    return user_projects


async def delete_project(project_id: UUID4, user_id: str):
    deleted_project = await Projects.filter(id=project_id, owner__id=user_id).first()

    if not deleted_project:
        raise DoesNotExist("Проект не найден")

    await deleted_project.delete()
    return deleted_project


async def add_member_to_project(user_id: str, project: Projects):
    user = await get_user_by_id(user_id)

    await project.invited_members.add(user)
    await project.save()


async def serialize_project(project: Projects):
    members = await project.invited_members.all()

    members_get_avatars_tasks = [
        get_user_avatar_base64(get_settings().BASE_AVATARS_DIR / member.avatar)
        if member.avatar
        else asyncio.sleep(0, result=None)
        for member in members
    ]

    members_avatars = await asyncio.gather(*members_get_avatars_tasks)

    serialized_members = [
        ProjectMember(username=m.username, avatar=avatar)
        for m, avatar in zip(members, members_avatars, strict=False)
    ]

    return ProjectOut(
        id=project.id,
        title=project.title,
        invited_members=serialized_members,
        modified_at=project.modified_at,
    )
