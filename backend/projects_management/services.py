from tortoise import transactions

from users.models import Users
from users.services import get_user_by_username

from .models import Invitations, Projects
from .schemas import ProjectIn


@transactions.atomic()
async def create_project_and_invite_members(project_data: ProjectIn, owner_sub: str):
    project = await create_project(project_data, owner_sub)
    await invite_members(project, project_data.invited_members)
    return project


async def create_project(project_data: ProjectIn, owner_sub: str):
    owner = await get_user_by_username(owner_sub)
    created_project = await Projects.create(title=project_data.title, owner=owner)
    return created_project


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
