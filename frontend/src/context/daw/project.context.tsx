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
  PayloadMetadata,
  ProjectContextType,
  ProjectWithPayload,
  Track,
} from "../../types/daw.types";

const ProjectContext = createContext<ProjectContextType>();

export const ProjectProvider: ParentComponent = (props) => {
  const { uuid } = useParams();
  const { getProjectWithPayload } = useDawApi();
  const navigate = useNavigate();

  const [project, { mutate }] = createResource<ProjectWithPayload | null>(
    async () => {
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
    },
  );

  const [tracks, setTracks] = createStore<Track[]>([]);
  const DEFAULT_METADATA: PayloadMetadata = {
    bpm: 120,
    totalVolume: 50,
    beatNumber: 4,
  };

  return (
    <Switch>
      <Match when={project.loading}>
        <SyncopaLoader />
      </Match>

      <Match when={project()}>
        {(projectValue) => {
          if (projectValue().payload?.tracks) {
            setTracks(projectValue().payload.tracks ?? []);
          }

          if (!projectValue().payload) {
            mutate((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                payload: {
                  metadata:DEFAULT_METADATA,
                  tracks: [],
                },
              };
            });
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
