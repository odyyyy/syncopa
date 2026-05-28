import toast from "solid-toast";
import { useProjectContext } from "@/context/daw/project.context";
import { accessToken } from "../store/auth.store";
import { ConnectionData, ProjectChanges, CoopOperationsHandlers, SyncOperation, Target } from "../types/coop.types";
import { SetStoreFunction } from "solid-js/store";
import { handleCoopEvents } from "./handleCoopEvents";
import { RemoteCursor } from "../types/coop.types";
import { userData } from "@/store/user.store";

const setupCoopConnections = (
  setCoopSessionMembers: SetStoreFunction<ProjectMember[]>,
  handlers: CoopOperationsHandlers,
  setRemoteCursors: SetStoreFunction<Record<string, RemoteCursor>>,  // +
) => {
  const { project } = useProjectContext();
  const projectId = project()?.projectId;
  const websocketConnection = new WebSocket(
    `ws://localhost:8000/ws/sessions/${projectId}?access_token=${accessToken()}`,
  );

  websocketConnection.onopen = () => {
    toast.success("Сессия совместной работы активна");

    let lastSent = 0;
    document.addEventListener("mousemove", (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSent < 50) return;
      lastSent = now;
      if (websocketConnection.readyState !== WebSocket.OPEN) return;
      websocketConnection.send(JSON.stringify({
        operation: SyncOperation.TRANSFORM,
        target: Target.CURSOR,
        payload: { userId: userData.id, username: userData.username, x: e.clientX, y: e.clientY },
        timestamp: now,
      }));
    });
  };

  websocketConnection.onmessage = (income_event: MessageEvent) => {
    const data: ConnectionData | ProjectChanges = JSON.parse(income_event.data);
    if (!data || typeof data !== "object") return;

    if ("operation" in data && data.target === Target.CURSOR && data.operation === SyncOperation.TRANSFORM) {
      const { userId, username, x, y } = data.payload;
      console.log("receive cursor", x, y, userId, username);
      setRemoteCursors(userId, { userId, username, x, y });  // +
      return;
    }

    handleCoopEvents(data as ConnectionData | ProjectChanges, setCoopSessionMembers, handlers);
  };

  websocketConnection.onerror = (error: Event) => {
    
    toast.error("Ошибка сессии совместной работы.\nИзменения не будут синхронизированы");
    console.error("WebSocket error", error);
  };

  websocketConnection.onclose

  return websocketConnection;
};

export default setupCoopConnections;