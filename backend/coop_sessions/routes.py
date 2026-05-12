from fastapi import APIRouter, Query, WebSocket
from pydantic import UUID4
from starlette.websockets import WebSocketDisconnect

from coop_sessions.schemas import (
    ConnectionState,
    MemberConnectionInfo,
    ProjectChanges,
    SyncOperation,
    Target,
)
from coop_sessions.services import (
    create_or_update_session,
    get_authenticated_session_member,
    get_session_members,
)
from coop_sessions.websocket import session_connection_manager
from shared.dependencies import RedisCoopDep

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

    current_member = await get_authenticated_session_member(access_token, project_id)
    user_id = str(current_member.id)

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
            income_data: dict = await websocket.receive_json()
            await session_connection_manager.broadcast(
                user_id,
                session_id,
                ProjectChanges(
                    operation=SyncOperation(income_data["operation"]),
                    target=Target(income_data["target"]),
                    payload=income_data["payload"],
                    timestamp=income_data["timestamp"],
                ),
            )

    except WebSocketDisconnect:
        await session_connection_manager.disconnect(session_id, user_id)
        await session_connection_manager.broadcast(
            user_id,
            session_id,
            MemberConnectionInfo(
                event=ConnectionState.DISCONNECTED, member=current_member
            ),
        )
