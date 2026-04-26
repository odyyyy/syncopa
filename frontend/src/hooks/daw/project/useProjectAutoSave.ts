import { useProjectContext } from "@/context/daw/project.context";
import { createEffect } from "solid-js";
import useProjectManager from "./useProjectManager";

export const useProjectAutoSave = () => {
  const { tracks, project } = useProjectContext();
  const { saveProjectChanges } = useProjectManager();

  let timeout: ReturnType<typeof setTimeout> | undefined;
  let initialProjectStateHash = hash(tracks);

  createEffect(() => {
    const projectHash = hash(tracks);
    if (initialProjectStateHash === projectHash) return;

    initialProjectStateHash = projectHash;

    if (!project()?.projectId) return;

    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      await saveProjectChanges(project()!.projectId);
    }, 500);
  });
};

export default useProjectAutoSave;

const hash = (obj: any): string => {
  let hash = 0;
  const str = JSON.stringify(obj);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};
