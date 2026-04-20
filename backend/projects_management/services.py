import asyncio

from pydantic import UUID4
from tortoise import transactions
from tortoise.exceptions import DoesNotExist
from tortoise.expressions import Q

from core.settings import get_settings
from users.models import Users
from users.services import get_user_avatar_image, get_user_by_id

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
        await Projects.filter(Q(owner__id=user_id) | Q(invited_members__id=user_id))
        .prefetch_related("invited_members", "owner")
        .order_by("-modified_at")
    )
    return user_projects


async def delete_project(project: Projects):
    await project.delete()
    return project


async def add_member_to_project(user_id: str, project: Projects):
    user = await get_user_by_id(user_id)

    await project.invited_members.add(user)
    await project.save()


async def serialize_project_users(project: Projects, user_id: str):
    members = list(project.invited_members)

    if project.owner.id != user_id:
        members.append(project.owner)

    members = [m for m in members if str(m.id) != user_id]

    members_avatars = await gather_users_avatars(members)
    serialized_members = [
        ProjectMember(id=m.id, username=m.username, avatar=avatar)
        for m, avatar in zip(members, members_avatars, strict=False)
    ]

    return serialized_members


async def serialize_project(project: Projects, user_id: str):
    serialized_members = await serialize_project_users(project, user_id)

    return ProjectOut(
        id=project.id,
        title=project.title,
        invited_members=serialized_members,
        modified_at=project.modified_at,
    )


async def gather_users_avatars(users: list[Users]):
    results = [None] * len(users)

    tasks = []
    indices = []

    for i, user in enumerate(users):
        if user.avatar:
            tasks.append(get_user_avatar_image(user.avatar))
            indices.append(i)

    if not tasks:
        return results

    avatars = await asyncio.gather(*tasks)

    for idx, avatar in zip(indices, avatars, strict=False):
        results[idx] = avatar

    return results
