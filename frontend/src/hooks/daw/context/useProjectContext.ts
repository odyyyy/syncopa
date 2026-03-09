import { useContext } from "solid-js";
import { ProjectContext } from "../../../context/daw/project.context";

export function useProjectContext()  {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("ProjectContext не найден");
  }
  return context;
}