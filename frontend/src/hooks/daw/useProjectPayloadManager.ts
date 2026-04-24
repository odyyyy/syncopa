import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import { useProjectContext } from "@/context/daw/project.context";
import { usePlayerContext } from "@/context/daw/player.context";

const useProjectPayloadManager = () => {
  const { updateProjectPayload } = useDawApi();
  const { setTracks} = useProjectContext();
  const {totalVolume, bpm} = usePlayerContext();
  const saveProjectChanges = async (projectId: string) => {
    setTracks(prevTracks => {
      updateProjectPayload(projectId, {
        metadata: {
          bpm: bpm(),
          totalVolume: totalVolume(),
        },
        tracks: prevTracks,
      }).then(res => {
        if (res.type === "success") {
          toast.success("Проект успешно сохранен");
        } else {
          toast.error("При сохранении проекта произошла ошибка");
        }
      });
      return prevTracks;
    });
  };

  return {
    saveProjectChanges,
  };
};

export default useProjectPayloadManager;
