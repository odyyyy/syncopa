import { useContextMenu } from "../../../context/daw/contextmenu.context";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import usePatternManage from "./usePatternManage";

const usePatternContextMenu = () => {
  const { openMenu } = useContextMenu();
  const { sendChangeEvent } = useSendChangeEvent();
  const { editPattern, removePattern } = usePatternManage();

  const handlePatternContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openMenu(e.clientX, e.clientY, [
      {
        label: "Изменить паттерн",
        icon: "✎",
        onClick: () => editPattern(e),
      },
      {
        label: "Изменить пресет",
        icon: "♬",
        onClick: () => {},
      },
      {
        label: "Удалить паттерн",
        icon: "✕",
        onClick: () => {
          const patternId = (
            (e.target as HTMLElement).closest(".pattern") as HTMLElement
          )?.dataset.patternId;
          const trackId = (
            (e.target as HTMLElement).closest(".track") as HTMLElement
          )?.dataset.trackId;
          if (!patternId || !trackId) return;
          removePattern(patternId, trackId);
          sendChangeEvent(SyncOperation.REMOVE, Target.PATTERN, {
            trackId,
            patternId,
          });
        },
      },
    ]);
  };
  return { handlePatternContextMenu };
};
export default usePatternContextMenu;
