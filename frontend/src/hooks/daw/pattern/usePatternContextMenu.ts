import { PatternType } from "@/types/daw.types";
import { useContextMenu } from "../../../context/daw/contextmenu.context";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import usePatternManage from "./usePatternManage";

const usePatternContextMenu = () => {
  const { openMenu } = useContextMenu();
  const { sendChangeEvent } = useSendChangeEvent();
  const { editPattern, removePattern } = usePatternManage();

  const handlePatternContextMenu = (e: MouseEvent, pattern: PatternType) => {
    e.preventDefault();
    e.stopPropagation();
    const isVst = pattern.type !== "audio";

    openMenu(e.clientX, e.clientY, [
      ...(isVst
        ? [
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
          ]
        : []),
      {
        label: "Удалить паттерн",
        icon: "✕",
        onClick: () => {
          const target = e.target as HTMLElement;
          const patternId = target
            .closest(".pattern")
            ?.getAttribute("data-pattern-id");
          const trackId = target
            .closest(".track")
            ?.getAttribute("data-track-id");

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
