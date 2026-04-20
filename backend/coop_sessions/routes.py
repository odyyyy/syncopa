from authx import RequestToken
from fastapi import APIRouter, Query, WebSocket
from pydantic import UUID4
from starlette.websockets import WebSocketDisconnect

from auth.config import auth
from coop_sessions.schemas import ConnectionState, MemberConnectionInfo
from coop_sessions.services import create_or_update_session, get_current_session_member, get_session_members
from coop_sessions.websocket import session_connection_manager
from projects_management.permissions import require_project_member_or_owner_permission
from shared.dependencies import RedisCoopDep
from users.services import get_user_by_id

session_ws_router = APIRouter(prefix="/ws/sessions")


@session_ws_router.websocket("/{project_id}")
async def coop_session_manager(
    websocket: WebSocket,
    project_id: UUID4,
    redis: RedisCoopDep,
    access_token: str = Query(...),
):
    if not access_token:
        await websocket.close()
        return

    access_token_payload = auth.verify_token(
        RequestToken(token=access_token, csrf=None, type="access", location="query")
    )
    user_id = access_token_payload.sub
    user = await get_user_by_id(user_id)
    await require_project_member_or_owner_permission(project_id, user)
    current_member = await get_current_session_member(user)

    session_id = str(project_id)

    await create_or_update_session(session_id, user_id, redis)
    await session_connection_manager.connect(websocket, session_id, user_id)

    session_members = await get_session_members(session_id, redis)

    await websocket.send_json(
        MemberConnectionInfo(
            event=ConnectionState.INIT, member=session_members
        ).model_dump(mode="json")
    )

    await session_connection_manager.broadcast(
        user_id,
        session_id,
        MemberConnectionInfo(event=ConnectionState.CONNECTED, member=current_member),
    )
    try:
        while True:
            income_data = await websocket.receive_json()
            await session_connection_manager.broadcast(user_id, session_id, income_data)

    except WebSocketDisconnect:
        await session_connection_manager.disconnect(session_id, user_id)
        await session_connection_manager.broadcast(
            user_id,
            session_id,
            MemberConnectionInfo(
                event=ConnectionState.DISCONNECTED, member=current_member
            ),
        )
