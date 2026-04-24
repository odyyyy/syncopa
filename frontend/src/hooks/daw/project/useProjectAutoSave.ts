import { useProjectContext } from "@/context/daw/project.context";
import { createEffect } from "solid-js";
import useProjectManager from "./useProjectManager";

export const useProjectAutoSave = () => {
  const { tracks, project } = useProjectContext();
  const { saveProjectChanges } = useProjectManager();

  let timeout: ReturnType<typeof setTimeout> | undefined;
  createEffect(() => {
    const payload = [...tracks];

    if (!project()?.projectId) return;

    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      await saveProjectChanges(project()!.projectId);
    }, 500);
  });
};

export default useProjectAutoSave;
