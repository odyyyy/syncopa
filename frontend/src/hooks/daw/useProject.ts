import { useContext } from "solid-js";
import { ProjectContext } from "../../context/daw";

export function useProjectData()  {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("ProjectContext не найден");
  }
  return context;
}