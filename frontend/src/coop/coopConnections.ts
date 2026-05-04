import toast from "solid-toast";
import { useProjectContext } from "@/context/daw/project.context";
import { accessToken } from "../store/auth";
import { ConnectionData, ProjectChanges, CoopOperationsHandlers } from "../types/coop.types";

import { SetStoreFunction } from "solid-js/store";
import { handleCoopEvents } from "./handleCoopEvents";

const setupCoopConnections = (
  setCoopSessionMembers: SetStoreFunction<ProjectMember[]>,
  handlers: CoopOperationsHandlers,
) => {
  const { project } = useProjectContext();
  const projectId = project()?.projectId;

  const websocketConnection = new WebSocket(
    `ws://localhost:8000/ws/sessions/${projectId}?access_token=${accessToken()}`,
  );
  // test local ip 192.168.1.64
  
  websocketConnection.onopen = () => {
    toast.success("Сессия совместной работы активна");
  };

  websocketConnection.onmessage = (income_event: MessageEvent) => {
    const data: ConnectionData | ProjectChanges = JSON.parse(income_event.data);

    if (!data || typeof data !== "object") return;

    handleCoopEvents(
      data as ConnectionData | ProjectChanges,
      setCoopSessionMembers,
      handlers,
    );
  };

  websocketConnection.onerror = (error: Event) => {
    toast.error(
      "Ошибка сессии совместной работы.\nИзменения не будут синхронизированы",
    );
    console.error("WebSocket error", error);
  };

  return websocketConnection;
};
export default setupCoopConnections;
