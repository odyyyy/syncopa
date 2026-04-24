import { Note } from "../../../types/daw.types";
import { useProjectContext } from "@/context/daw/project.context";

const useUpdatePatternPosAndWidth = () => {
  const { setTracks } = useProjectContext();
  const updatePatternPosAndWidth = (
    patternId: string,
    trackId: string,
    pos: number,
    width: number,
    notes?: Note[],
  ) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.trackId !== trackId) return track;

        return {
          ...track,
          patterns:
            track.patterns?.map((p) =>
              p.patternId === patternId
                ? {
                    ...p,
                    pos,
                    width,
                    ...(p.type === "vst" && { notes }),
                  }
                : p,
            ) ?? null,
        };
      }),
    );
  };
  return { updatePatternPosAndWidth };
};

export default useUpdatePatternPosAndWidth;
