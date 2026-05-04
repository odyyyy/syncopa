import { useVcsApi } from "@/api/vcs.api";
import { useCoopContext } from "@/context/coop/coopsession.context";
import { usePlayerContext } from "@/context/daw/player.context";
import { useProjectContext } from "@/context/daw/project.context";
import { useTimelineContext } from "@/context/daw/timeline.context";
import { useVCSContext } from "@/context/vcs/vcs.context";
import { applyIncomeOperation } from "@/coop/handleCoopEvents";
import { PayloadMetadata } from "@/types/daw.types";
import { createSignal } from "solid-js";
import toast from "solid-toast";

const useVcsModal = () => {
  const {
    versionControlStore,
    setVersionControlStore,
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
    setVCSState,
    VCSState,
  } = useVCSContext();

  const [vcsLoading, setVcsLoading] = createSignal(false);
  const {
    createBranch,
    loadSelectedVersion: loadVersion,
    createVersion,
  } = useVcsApi();
  const { project, setTracks } = useProjectContext();
  const { setBpm } = usePlayerContext();

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
        throw new Error("Не удалось получить данные о ветке");
      }

      setIsCreatingNewBranch(false);
      setNewBranchName("");
      setSelectedBranchInModal(branchName);
      const { branchTitle, initialVersion } = res.data;

      setVersionControlStore((prev) => ({
        ...prev,
        branches: [...prev.branches, branchTitle],
        versions: { ...prev.versions, [branchName]: [initialVersion] },
      }));

      toast.success(`Ветка ${branchName} успешно создана!`);
    } else if (res.type === "error") {
      toast.error(res.detail);
      throw new Error(res.detail);
    }
  };

  const { coopOperationsHandlers, websocketConnection } = useCoopContext();
  const { setTotalVolume } = usePlayerContext();
  const { setBeatNumber } = useTimelineContext();

  const setProjectMetadata = (metadata: PayloadMetadata) => {
    setBpm(metadata.bpm);
    setTotalVolume(metadata.totalVolume);
    setBeatNumber(metadata.beatNumber);
  };

  const loadSelectedVersion = async () => {
    if (!selectedBranchInModal()) {
      toast.error("Выберите ветку для фиксации версии");
      throw new Error("Выберите ветку для фиксации версии");
    }

    if (!selectedVersion() || !selectedVersion()?.id) {
      toast.error("Выберите версию к которой вы хотите перейти");
      throw new Error("Выберите версию к которой вы хотите перейти");
    }

    const res = await loadVersion(
      project()?.projectId!,
      selectedBranchInModal(),
      selectedVersion()?.id!,
    );
    if (res.type === "error") {
      toast.error(res.detail);
      throw new Error(res.detail);
    }

    if (!res.data) {
      toast.error("Не удалось загрузить версию");
      throw new Error("Не удалось загрузить версию");
    }

    if (res.data.type === "snapshot") {
      setTracks(res.data.snapshot.tracks);
      setProjectMetadata(res.data.snapshot.metadata!);
    } else if (res.data.type === "patch") {
      setTracks(res.data.initialVersion.tracks);
      setProjectMetadata(res.data.initialVersion.metadata!);
      
      for (const operation of res.data.patch) {
        applyIncomeOperation(operation, coopOperationsHandlers);
      }
    } else {
      toast.error("Не удалось загрузить версию");
      throw new Error("Не удалось загрузить версию");
    }
    setVCSState("currentVersion", {
      ...selectedVersion()!,
      branch: selectedBranchInModal(),
    });
  };

  const commitVersion = async (versionMessage: string) => {
    if (!selectedBranchInModal()) {
      toast.error("Выберите ветку для коммита");
      throw new Error("Выберите ветку для коммита");
    }

    if (
      !VCSState.currentVersion ||
      !VCSState.isVCSModeActive ||
      !VCSState.currentVersion.isHead
    ) {
      toast.error(
        "Для фиксации Вы должны сначала перейти к версии с пометкой HEAD, на ветку где она находится.\n\nЕсли вы хотите зафиксировать новую версию проекта создайте новую ветку!",
        {
          duration: 10000,
        },
      );
      throw new Error();
    }

    if (VCSState.patches.length === 0) {
      toast.error("Нет изменений для фиксации");
      throw new Error("Нет изменений для фиксации");
    }

    if (VCSState.currentVersion.branch !== selectedBranchInModal()) {
      toast.error(`Выберите ветку ${VCSState.currentVersion.branch}`);
      throw new Error(`Выберите ветку (${VCSState.currentVersion.branch})`);
    }

    const res = await createVersion(
      project()?.projectId!,
      selectedBranchInModal()!,
      {
        type: "patch",
        changes: VCSState.patches,
      },
      versionMessage,
    );

    if (res.type === "error") {
      toast.error(res.detail);
      throw new Error(res.detail);
    }

    setVersionControlStore(
      "versions",
      res.data.branchTitle,
      (version) => version.isHead === true,
      "isHead",
      false,
    );

    setVersionControlStore("versions", res.data.branchTitle, (prev) => {
      return [res.data.versionMetadata, ...prev];
    });

    setSelectedVersion(res.data.versionMetadata);

    toast.success("Версия успешно зафиксирована");
    setVCSState({
      ...VCSState,
      currentVersion: {
        ...res.data.versionMetadata,
        branch: res.data.branchTitle,
      },
      patches: [],
    });
  };

  return {
    isCreatingNewBranch,
    setIsCreatingNewBranch,
    newBranchName,
    selectedBranchInModal,
    createNewBranch,
    setSelectedBranchInModal,
    setNewBranchName,
    versionControlStore,
    setVersionControlStore,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    selectedVersion,
    setSelectedVersion,
    branchesWithVersionsMetadata,
    commitVersion,
    setVCSState,
    loadSelectedVersion,
    vcsLoading,
    setVcsLoading,
    websocketConnection,
    VCSState,
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
