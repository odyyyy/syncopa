import base64
import uuid
from datetime import timedelta
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from tortoise import timezone, transactions
from tortoise.exceptions import DoesNotExist
from tortoise.expressions import Q

from auth.utils import hash_password, verify_password
from core.settings import get_settings
from projects_management.models.invitations import Invitations, InvitationStatus
from projects_management.schemas import ProjectMember
from shared.dependencies import AccessTokenRequiredPayload
from shared.services import save_file
from users.models import Users
from users.schemas import UserUpdateIn


async def get_user_by_id(user_id: str):
    user = await Users.get_or_none(id=user_id)
    if user is None:
        raise DoesNotExist("Пользователь не найден")
    return user


async def get_current_user(
    user_payload: AccessTokenRequiredPayload,
) -> Users:
    user = await get_user_by_id(user_payload.sub)
    return user


async def get_matched_users_by_username(username: str):
    from projects_management.services import gather_users_avatars

    users = await Users.filter(username__icontains=username).only(
        "id", "username", "avatar"
    )
    users_avatars = await gather_users_avatars(users)
    users = [
        ProjectMember(id=user.id, username=user.username, avatar=avatar)
        for user, avatar in zip(users, users_avatars, strict=False)
    ]
    return users


# Invitations
async def get_user_invitations(user_id: str):
    invitations = await Invitations.filter(
        Q(to_user=user_id)
        & Q(status=InvitationStatus.PENDING.value)
        & Q(expires__gt=timezone.now()),
    ).values(
        "id", sender_username="from_user__username", project_title="project__title"
    )
    return invitations


@transactions.atomic()
async def change_invitation_status(
    invitation_id: str, status: InvitationStatus, user_id: str
):
    invitation = (
        await Invitations.filter(id=invitation_id, to_user=user_id)
        .select_related("project")
        .first()
    )
    if invitation is None:
        raise ValueError("Данные о приглашении не найдены")

    invitation.status = status

    if invitation.status == InvitationStatus.REJECTED.value:
        await invitation.save()
        return invitation

    if (
        invitation.status == InvitationStatus.ACCEPTED.value
        and await invitation.project.members.filter(id=user_id).exists()
    ):
        raise ValueError("Вы уже состоите в этом проекте")

    MAX_MEMBERS_NUMBER = 10
    if (
        invitation.status == InvitationStatus.ACCEPTED.value
        and await invitation.project.members.all().count() >= MAX_MEMBERS_NUMBER
    ):
        raise ValueError("Проект достиг максимального количества участников")

    from projects_management.services import (
        add_member_to_project,
        serialize_project,
    )

    if invitation.status == InvitationStatus.ACCEPTED.value:
        await add_member_to_project(
            user_id=user_id,
            project=invitation.project,
        )

    await invitation.save()
    await invitation.project.fetch_related("members", "owner")
    return {
        "invitation": invitation,
        "project": await serialize_project(invitation.project, user_id),
    }


# Data update
@transactions.atomic()
async def update_user_data(user_id: str, user_data: UserUpdateIn):
    user_updated_data: dict = user_data.model_dump(exclude_none=True)
    user = await get_user_by_id(user_id)
    if (timezone.now() - user.modified_at) < timedelta(minutes=60) and (
        user.modified_at - user.created_at
    ) > timedelta(seconds=1):
        raise ValueError("Данные можно обновить раз в час")

    old_password = user_updated_data.get("old_password", None)
    if old_password is not None and not verify_password(
        user.password_hash, old_password
    ):
        raise ValueError("Старый пароль введен неверно")

    user_updated_data.pop("old_password", None)

    for key, value in user_updated_data.items():
        if key == "password":
            user.password_hash = hash_password(value)
            user_updated_data["password"] = None
            continue
        elif key == "avatar":
            user.avatar = await get_avatar_path(value, user_id)
            user_updated_data["avatar"] = await get_user_avatar_image(user.avatar)
            continue
        setattr(user, key, value)

    await user.save()

    return user_updated_data


# Images
async def get_avatar_path(avatar: UploadFile, user_id: str) -> str:

    avatar_extension = get_image_extension_by_memetype(avatar)
    user_avatar_dir = f"{user_id}/avatars/"

    user_avatar_file_path = (
        get_settings().BASE_AVATARS_DIR.resolve()
        / user_avatar_dir
        / Path(
            f"{str(uuid.uuid4()) + '_' + timezone.now().strftime('%Y-%m-%d-%H-%M-%S')}{avatar_extension}"
        )
    )

    await save_file(avatar, user_avatar_file_path)

    return str(user_avatar_file_path)


supported_images_extensions = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
}


def get_image_extension_by_memetype(avatar: UploadFile) -> str:
    if avatar.filename is not None:
        return Path(avatar.filename).suffix

    elif avatar.content_type is not None:
        return supported_images_extensions.get(avatar.content_type, "")

    else:
        raise ValueError("Не удалось определить расширение изображения")


async def get_user_avatar_image(user_avatar_url: str) -> str | None:
    if not user_avatar_url:
        return None

    user_avatar_abs_path = get_settings().BASE_AVATARS_DIR / user_avatar_url

    async with aiofiles.open(user_avatar_abs_path, "rb") as f:
        avatar_data = await f.read()
        encoded_avatar = base64.b64encode(avatar_data).decode("utf-8")
        avatar_base64 = (
            f"data:image/{Path(user_avatar_abs_path).suffix};base64,{encoded_avatar}"
        )
    return avatar_base64
