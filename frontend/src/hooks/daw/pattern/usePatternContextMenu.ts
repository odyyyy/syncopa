import { PatternType, PatternVST } from "@/types/daw.types";
import { useContextMenu } from "../../../context/daw/contextmenu.context";
import { useSendChangeEvent } from "../../../coop/handleCoopEvents";
import { SyncOperation, Target } from "../../../types/coop.types";
import usePatternManager from "./usePatternManager";
import { useClipboardContext } from "@/context/daw/clipboard.context";
import { useProjectContext } from "@/context/daw/project.context";

const usePatternContextMenu = () => {
  const { openMenu } = useContextMenu();
  const { tracks } = useProjectContext();
  const { sendChangeEvent } = useSendChangeEvent();
  const { editPattern, removePattern } = usePatternManager();
  const { setClipboard } = useClipboardContext();

  const patternAndTrackIdByEventTarget = (e: MouseEvent) => {
    const patternId = (
      (e.target as HTMLElement).closest(".pattern") as HTMLElement
    )?.dataset.patternId;
    const trackId = ((e.target as HTMLElement).closest(".track") as HTMLElement)
      ?.dataset.trackId;
    return { patternId, trackId };
  };

  const handlePatternContextMenu = (e: MouseEvent, pattern: PatternType) => {
    e.preventDefault();
    e.stopPropagation();
    const isVst = pattern.type === "vst";
    const { patternId, trackId } = patternAndTrackIdByEventTarget(e);
    const track = tracks.find((t) => t.trackId === trackId);

    openMenu(e.clientX, e.clientY, [
      ...(isVst
        ? [
            {
              label: "Изменить паттерн",
              icon: "✎",
              onClick: () => editPattern(e),
            },
            {
              label: "Копировать",
              icon: "⎘",
              onClick: () => {
                setClipboard(pattern);
              },
            },

            // {
            //   label: "Изменить пресет",
            //   icon: "♬",
            //   onClick: () => {},
            // },
          ]
        : []),
      {
        label: "Удалить паттерн",
        icon: "✕",
        onClick: () => {
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
