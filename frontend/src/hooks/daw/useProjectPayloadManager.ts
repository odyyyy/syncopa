import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import { useProjectData } from "./useProject";

const useProjectPayloadManager = () => {
  const { updateProjectPayload } = useDawApi();
  const { tracks } = useProjectData();

  const saveProjectChanges = async (projectId: string) => {
    const res = await updateProjectPayload(projectId, {
      metadata: {
        totalVolume: 50,
      },
      tracks: [...tracks],
    });
    if (res.type === "success") {
      toast.success("Проект успешно сохранен");
    } else {
      toast.error("При сохранении проекта произошла ошибка");
    }
  };

  return {
    saveProjectChanges,
  };
};

export default useProjectPayloadManager;
