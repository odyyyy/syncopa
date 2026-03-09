import {
  createResource,
  ParentComponent,
  Switch,
  Match,
  createSignal,
} from "solid-js";
import { createContext } from "solid-js";
import toast from "solid-toast";
import useDawApi from "../../api/daw.api";
import { useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import SyncopaLoader from "../../components/utils/SyncopaLoading";
import {
  ProjectContextType,
  ProjectWithPayload,
  Track,
} from "../../types/daw.types";

export const ProjectContext = createContext<ProjectContextType>();

export const ProjectProvider: ParentComponent = (props) => {
  const { uuid } = useParams();
  const { getProjectWithPayload } = useDawApi();

  const [project] = createResource<ProjectWithPayload | null>(async () => {
    const res = await getProjectWithPayload(uuid!);
    if (res.type === "success") {
      return res.data;
    }
    toast.error("Ошибка загрзуки проекта");
    return null;
  });

  const [tracks, setTracks] = createStore<Track[]>([]);

  return (
    <Switch>
      <Match when={project.loading}>
        <SyncopaLoader />
      </Match>

      <Match when={project()}>
        <ProjectContext.Provider value={{ project, tracks, setTracks }}>
          {props.children}
        </ProjectContext.Provider>
      </Match>
    </Switch>
  );
};
