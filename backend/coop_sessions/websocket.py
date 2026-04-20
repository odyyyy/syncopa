from fastapi import WebSocket

from coop_sessions.schemas import MemberConnectionInfo, ProjectChanges
from coop_sessions.services import delete_session
from coop_sessions.utils import Singleton


class SessionsConnectionsManager(metaclass=Singleton):
    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super().__new__(cls)
        return cls.instance

    def __init__(self):
        self.active_connections: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str, user_id: str):
        await websocket.accept()
        if self.active_connections.get(session_id) is None:
            self.active_connections[session_id] = {}
        self.active_connections[session_id][user_id] = websocket

    async def disconnect(self, session_id: str, user_id: str):
        if self.active_connections.get(session_id) and self.active_connections[
            session_id
        ].get(user_id):
            del self.active_connections[session_id][user_id]
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
                await delete_session(session_id)

    async def broadcast(
        self,
        initiator_user_id: str,
        session_id: str,
        changes: ProjectChanges | MemberConnectionInfo,
    ):
        if self.active_connections.get(session_id):
            current_user_connection = self.active_connections[session_id].get(
                initiator_user_id
            )
            for user_connection in self.active_connections[session_id].values():
                if user_connection != current_user_connection:
                    await user_connection.send_json(
                        changes.model_dump(mode="json")
                    )


session_connection_manager = SessionsConnectionsManager()
