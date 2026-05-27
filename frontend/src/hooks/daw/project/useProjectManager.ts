import toast from "solid-toast";
import useDawApi from "../../../api/daw.api";
import { useProjectContext } from "@/context/daw/project.context";
import { usePlayerContext } from "@/context/daw/player.context";
import { audioEngine } from "@/instruments/audioEngine";
import { useTimelineContext } from "@/context/daw/timeline.context";

const useProjectManager = () => {
  const { updateProjectPayload } = useDawApi();
  const { tracks } = useProjectContext();
  const { totalVolume, bpm } = usePlayerContext();
  const { beatNumber } = useTimelineContext();

  const saveProjectChanges = async (projectId: string) => {
    updateProjectPayload(projectId, {
      metadata: {
        bpm: bpm(),
        totalVolume: totalVolume(),
        beatNumber: beatNumber(),
      },
      tracks,
    }).then((res) => {
      if (res.type === "error") {
        toast.error("При сохранении проекта произошла ошибка");
        throw new Error("Ошибка при сохранении проекта");
      }
    });
  };

  const saveProjectFile = async () => {
    const projectData = {
      metadata: {
        bpm: bpm(),
        totalVolume: totalVolume(),
        beatNumber: beatNumber(),
      },
      tracks,
    };

    try {
      const jsonString = JSON.stringify(projectData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const d = new Date();
      link.download = `${project()?.title}_${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}-${d.getHours()}-${d.getMinutes()}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("При сохранении проекта произошла ошибка");
      throw error;
    }
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
    saveProjectFile,
  };
};

export default useProjectManager;
