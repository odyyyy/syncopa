from uuid import UUID

from pydantic import UUID4

from coop_sessions.schemas import CoopSession
from projects_management.schemas import ProjectMember
from projects_management.services import gather_users_avatars
from shared.dependencies import RedisAsync, get_redis_coop
from users.models import Users
from users.services import get_user_avatar_image

COOP_REDIS_TAG = "coop"
SESSION_EXPIRES = 24 * 60 * 60


async def get_session_members(
    session_id: str, redis: RedisAsync
) -> list[ProjectMember]:
    session_raw = await redis.get(f"{COOP_REDIS_TAG}:{session_id}")
    if not session_raw:
        return []
    session = CoopSession.model_validate_json(session_raw)
    users_in_session = await Users.filter(id__in=session.members)
    avatars = await gather_users_avatars(users_in_session)

    return [
        ProjectMember(
            id=member.id,
            username=member.username,
            avatar=avatar,
        )
        for member, avatar in zip(users_in_session, avatars, strict=False)
    ]


async def create_or_update_session(session_id: str, user_id: str, redis: RedisAsync):
    is_session_exist = await redis.exists(f"{COOP_REDIS_TAG}:{session_id}")
    if is_session_exist:
        session_raw = await redis.get(f"{COOP_REDIS_TAG}:{session_id}")
        session = CoopSession.model_validate_json(session_raw)
        session.members.append(UUID(user_id))
        await redis.set(
            f"{COOP_REDIS_TAG}:{session_id}",
            value=session.model_dump_json(),
            ex=SESSION_EXPIRES,
        )
    else:
        session = CoopSession(
            project_id=UUID(session_id), members=[UUID(user_id)], changes=[]
        )
        await redis.set(
            f"{COOP_REDIS_TAG}:{session_id}",
            value=session.model_dump_json(),
            ex=SESSION_EXPIRES,
        )


async def delete_session(session_id: str):
    redis = await get_redis_coop()
    await redis.delete(f"{COOP_REDIS_TAG}:{session_id}")


async def get_current_session_member(user: Users) -> ProjectMember:

    user_avatar_image = await get_user_avatar_image(user.avatar)
    member = ProjectMember(
        id=user.id,
        username=user.username,
        avatar=user_avatar_image,
    )
    return member
