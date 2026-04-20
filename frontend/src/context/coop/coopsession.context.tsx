import { createContext, onMount, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import CoopCursor from "../../components/DAW/Coop/CoopCursor";
import { useProjectContext } from "../../hooks/daw/context/useProjectContext";
import { accessToken } from "../../store/auth";
import toast from "solid-toast";
import {
  ConnectionState,
  CoopSessionContextType,
  MemberConnectionInfo,
  ProjectChanges,
} from "../../types/coop.types";

export const CoopSessionContext = createContext<CoopSessionContextType>();

export const CoopSessionProvider: ParentComponent = (props) => {
  const [coopSessionMembers, setCoopSessionMembers] = createStore<
    ProjectMember[]
  >([]);

  onMount(() => {
    const { project } = useProjectContext();
    const projectId = project()?.projectId;

    const websocketConnection = new WebSocket(
      `ws://localhost:8000/ws/sessions/${projectId}?access_token=${accessToken()}`,
    );

    websocketConnection.onopen = () => {
      toast.success("Сессия совместной работы активна");
    };
    websocketConnection.onmessage = (income_event: MessageEvent) => {
      const data: MemberConnectionInfo | ProjectChanges = JSON.parse(
        income_event.data,
      );
      if (!data || typeof data !== "object") return;
      if ("event" in data && "member" in data) {
        switch (data.event) {
          case ConnectionState.INIT:
            setCoopSessionMembers(data.member);
            break;
          case ConnectionState.CONNECTED:
            setCoopSessionMembers((prev) => [...prev, data.member]);
            break;
          case ConnectionState.DISCONNECTED:
            setCoopSessionMembers((prev) =>
              prev.filter((member) => member.id !== data.member.id),
            );
            break;
        }
      } else {
      }
    };
    websocketConnection.onerror = (error: Event) => {
      toast.error(
        "Ошибка сессии совместной работы.\nИзменения не будут синхронизированы",
      );
      console.log("WebSocket error", error);
    };
  });

  return (
    <CoopSessionContext.Provider
      value={{
        coopSessionMembers,
        setCoopSessionMembers,
      }}
    >
      <CoopCursor />
      {props.children}
    </CoopSessionContext.Provider>
  );
};

export const useCoopSession = () => {
  const context = useContext(CoopSessionContext);
  if (!context) {
    throw new Error("CoopSessionContext не найден");
  }
  return context;
};
