import {
  createResource,
  ParentComponent,
  Switch,
  Match,
  useContext,
} from "solid-js";
import { createContext } from "solid-js";
import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import { useNavigate, useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import SyncopaLoader from "../../components/utils/Loaders/SyncopaLoading";
import {
  ProjectContextType,
  ProjectWithPayload,
  Track,
} from "../../types/daw.types";

const ProjectContext = createContext<ProjectContextType>();

export const ProjectProvider: ParentComponent = (props) => {
  const { uuid } = useParams();
  const { getProjectWithPayload } = useDawApi();
  const navigate = useNavigate();

  const [project] = createResource<ProjectWithPayload | null>(async () => {
    const res = await getProjectWithPayload(uuid!);
    if (res.type === "success") {
      return res.data;
    } else if (res.type === "error") {
      if (res.status === 404) {
        toast.error("Проект не найден");
      } else if (res.status === 403) {
        toast.error("Проект не доступен");
      } else {
        toast.error("Ошибка загрзуки проекта");
      }
      navigate("/not-found");
    }
    return null;
  });

  const [tracks, setTracks] = createStore<Track[]>([]);

  return (
    <Switch>
      <Match when={project.loading}>
        <SyncopaLoader />
      </Match>

      <Match when={project()}>
        {(projectValue) => {
          if (tracks.length === 0 && projectValue().payload?.tracks) {
            setTracks(projectValue().payload.tracks ?? []);
          }

          return (
            <ProjectContext.Provider value={{ project, tracks, setTracks }}>
              {props.children}
            </ProjectContext.Provider>
          );
        }}
      </Match>
    </Switch>
  );
};

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("ProjectContext не найден");
  }
  return context;
}
