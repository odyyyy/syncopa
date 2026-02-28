from tortoise import timezone
from tortoise.exceptions import DoesNotExist
from tortoise.expressions import Q

from projects_management.models.invitations import Invitations, InvitationStatus
from users.models import Users


async def get_user_by_id(user_id: str):
    user = await Users.get_or_none(id=user_id)
    if user is None:
        raise DoesNotExist("Пользователь не найден")
    return user


async def get_matched_users_by_username(username: str):
    users = await Users.filter(username__icontains=username).values(
        "username", "avatar"
    )
    return users


async def get_user_invitations(user_id: str):
    invitations = await Invitations.filter(
        Q(to_user=user_id)
        & Q(status=InvitationStatus.PENDING.value)
        & Q(expires__gt=timezone.now()),
    ).values(
        "id", sender_username="from_user__username", project_title="project__title"
    )
    return invitations
