import { useVcsApi } from "@/api/vcs.api";
import { useProjectContext } from "@/context/daw/project.context";
import { createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";

const useVcsModal = () => {
  const [versionControlStore, setVersionControlStore] =
    createStore<VersionControlStore>({
      branches: [] as string[],
      versions: {} as Record<string, VersionMetadata[]>,
    });
  const [isCreatingNewBranch, setIsCreatingNewBranch] = createSignal(false);
  const [newBranchName, setNewBranchName] = createSignal("");
  const [currentBranch, setCurrentBranch] = createSignal("test");

  const [viewMode, setViewMode] = createSignal<"all" | "branch">("branch");
  const [activeTab, setActiveTab] = createSignal<"history" | "conflicts">(
    "history",
  );
  const [selectedCommit, setSelectedCommit] =
    createSignal<VersionMetadata | null>(null);

  const { createBranch, getProjectBranchesWithVersionsMetadata } = useVcsApi();
  const { project } = useProjectContext();

  const [branchesWithVersionsMetadata, { mutate }] =
    createResource(async () => {
      const res = await getProjectBranchesWithVersionsMetadata(
          project()?.projectId!,
        );
        
        if (res.type === "success") {
          setVersionControlStore(res.data);
          return;
        }
        
        toast.error(res.detail ?? "Не удалось загрузить систему контроля версий");
        throw new Error(res.detail ?? "Не удалось загрузить систему контроля версий");
    });

  const createNewBranch = async () => {
    const branchName = newBranchName().trim();
    if (!branchName) return;

    const res = await createBranch(
      project()?.projectId!,
      branchName,
      project()?.payload!,
    );

    if (res.type === "success") {
      if (!res.data.branchTitle || !res.data.initialVersion) {
        toast.error("Не удалось получить данные о ветке");
        return;
      }

      setIsCreatingNewBranch(false);
      setNewBranchName("");
      setCurrentBranch(branchName);
      const { branchTitle, initialVersion } = res.data;

      setVersionControlStore((prev) => ({
        ...prev,
        branches: [...prev.branches, branchTitle],
        versions: { ...prev.versions, [branchName]: [initialVersion] },
      }));

      toast.success(`Ветка ${branchName} успешно создана!`);
    } else if (res.type === "error") {
      toast.error(res.detail);
    }
  };

  return {
    isCreatingNewBranch,
    setIsCreatingNewBranch,
    newBranchName,
    currentBranch,
    createNewBranch,
    setCurrentBranch,
    setNewBranchName,
    versionControlStore,
    setVersionControlStore,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedCommit,
    setSelectedCommit,branchesWithVersionsMetadata
  };
};

export default useVcsModal;

export const generateColor = (seed?: string): string => {
  const sid = seed ?? Math.random().toString(36).substring(2, 15);
  const hash = String(sid)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const r = 255;
  const g = 100 + (hash % 100);
  return `#${((r << 16) | (g << 8) | 0).toString(16).padStart(6, "0")}`;
};
