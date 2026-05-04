import { useVcsApi } from "@/api/vcs.api";
import {
  createContext,
  createResource,
  createSignal,
  ParentComponent,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { useProjectContext } from "../daw/project.context";
import {
  VCSContextType,
  VersionControlStore,
  VersionMetadata,
  VCSStateType,
} from "@/types/vcs.types";

export const VCSContext = createContext<VCSContextType>();

export const VCSProvider: ParentComponent = (props) => {
  const [versionControlStore, setVersionControlStore] =
    createStore<VersionControlStore>({
      branches: [],
      versions: {},
    });

  const [VCSState, setVCSState] = createStore<VCSStateType>({
    isVCSModeActive: false,
    currentVersion: null,
    patches: [],
  });

  const [isCreatingNewBranch, setIsCreatingNewBranch] = createSignal(false);
  const [newBranchName, setNewBranchName] = createSignal("");
  const [selectedBranchInModal, setSelectedBranchInModal] = createSignal("");

  const [viewMode, setViewMode] = createSignal<"all" | "branch">("branch");
  const [activeTab, setActiveTab] = createSignal<"history" | "conflicts">(
    "history",
  );
  const [selectedVersion, setSelectedVersion] =
    createSignal<VersionMetadata | null>(null);

  const { getProjectBranchesWithVersionsMetadata } = useVcsApi();
  const { project } = useProjectContext();

  const [branchesWithVersionsMetadata, { mutate }] = createResource(
    async () => {
      const res = await getProjectBranchesWithVersionsMetadata(
        project()?.projectId!,
      );

      if (res.type === "success") {
        setVersionControlStore(res.data);
        return;
      }

      toast.error(res.detail ?? "Не удалось загрузить систему контроля версий");
      throw new Error(
        res.detail ?? "Не удалось загрузить систему контроля версий",
      );
    },
  );

  return (
    <VCSContext.Provider
      value={{
        versionControlStore,
        setVersionControlStore,
        VCSState,
        setVCSState,
        isCreatingNewBranch,
        setIsCreatingNewBranch,
        newBranchName,
        setNewBranchName,
        selectedBranchInModal,
        setSelectedBranchInModal,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        selectedVersion,
        setSelectedVersion,
        branchesWithVersionsMetadata,
      }}
    >
      {props.children}
    </VCSContext.Provider>
  );
};

export const useVCSContext = () => {
  const context = useContext(VCSContext);
  if (!context) {
    throw new Error("VCSContext не найден");
  }
  return context;
};
