import { useContextMenu } from "../../../context/daw/contextmenu.context";
import { usePianoRollContext } from "../../../context/daw/pianoroll.context";
import { PatternType, PatternVST } from "../../../types/daw.types";
import { useProjectContext } from "../context/useProjectContext";

const usePatternManage = () => {
  const { tracks, setTracks } = useProjectContext();
  const { setCurrentPatternAndTrackId , openPianoRoll} = usePianoRollContext();

  const addPatternOnTrack = (trackId: string) => {
    const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
    if (trackIndex === -1) return;

    const pattern: PatternVST = {
      patternId: crypto.randomUUID(),
      type: "vst",
      pos: 0,
      width: 1,
      instrumentId: null,
      title: "Pattern",
      notes: [],
      ref: null,
    };

    setTracks(trackIndex, "patterns", (prev: PatternType[] | null) =>
      prev ? [...prev, pattern] : [pattern],
    );
  };

  const { openMenu } = useContextMenu();
  const handlePatternContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openMenu(e.clientX, e.clientY, [
      {
        label: "Изменить паттерн",
        icon: "",
        onClick: () => {
          const patternId = ((e.target as HTMLElement).closest(".pattern") as HTMLElement)?.dataset.patternId;
          const trackId =  ((e.target as HTMLElement).closest(".track") as HTMLElement)?.dataset.trackId;
          if (!patternId) return;
          setCurrentPatternAndTrackId({
            trackId,
            patternId
          });
          openPianoRoll();
        },
      },
      {
        label: "Удалить паттерн",
        icon: "-",
        onClick: () => {
          const patternId = (e.currentTarget as HTMLElement)?.dataset.patternId;
          if (!patternId) return;
          
          const trackId = (
            (e.target as HTMLElement).closest(".track") as HTMLElement
          )?.dataset.trackId;
          if (!trackId) return;
          
          const trackIndex = tracks.findIndex((t) => t.trackId === trackId);
          if (trackIndex === -1) return;
          setTracks(trackIndex, "patterns", (prev: PatternType[] | null) =>
            prev ? prev.filter((p) => p.patternId !== patternId) : null,
          );
        },
      },
    ]);
  };

  return {
    addPatternOnTrack,
    handlePatternContextMenu,
  };
};

export default usePatternManage;
