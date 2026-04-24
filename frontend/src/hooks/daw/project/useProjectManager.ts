import toast from "solid-toast";
import useDawApi from "../../../api/daw.api";
import { useProjectContext } from "@/context/daw/project.context";
import { usePlayerContext } from "@/context/daw/player.context";
import { audioEngine } from "@/instruments/audioEngine";

const useProjectManager = () => {
  const { updateProjectPayload } = useDawApi();
  const { tracks } = useProjectContext();
  const { totalVolume, bpm } = usePlayerContext();

  const saveProjectChanges = async (projectId: string) => {
    updateProjectPayload(projectId, {
      metadata: {
        bpm: bpm(),
        totalVolume: totalVolume(),
      },
      tracks,
    }).then((res) => {
      if (res.type === "error") {
        toast.error("При сохранении проекта произошла ошибка");
        throw new Error("Ошибка при сохранении проекта");
      }
    });
  };

  const { project } = useProjectContext();
  const { loadAudioPatternFile } = useDawApi();

  const loadAudioPatternsUsedInProject = async (audioPatternsIds: string[]) => {
    const projectId = project()?.projectId;
    if (!projectId || audioPatternsIds.length === 0) return;

    const concurrency = 4;
    const queue = [...audioPatternsIds];

    const workers = Array.from({ length: concurrency }).map(async () => {
      while (queue.length) {
        const patternId = queue.shift();
        if (!patternId) return;

        const res = await loadAudioPatternFile(projectId, patternId);
        if (res.type === "error") {
          console.error("Ошибка загрузки", patternId);
          continue;
        }
        const url = URL.createObjectURL(res.data);

        await audioEngine.addAudioPlayer(patternId, url);
      }
    });

    await Promise.all(workers);
  };

  return {
    saveProjectChanges,
    loadAudioPatternsUsedInProject,
  };
};

export default useProjectManager;
