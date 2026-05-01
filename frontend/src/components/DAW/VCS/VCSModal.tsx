import { Component, Show } from "solid-js";
import ModalMenu from "../ModalMenu";
import useVcsModal from "@/hooks/daw/vcs/useVcsModal";
import LoadingOverlay from "@/components/utils/Loaders/LoadingOverlay";

import VCSBranches from "./VCSBranches";
import VCSInspector from "./VCSInspector";
import VCSFooter from "./VCSFooter";
import VCSHeader from "./VCSHeader";
import VCSHistory from "./VCSHistory";
import VCSConflicts from "./VCSConflicts";

const VCSModal: Component<{
  dialogRef: (el: HTMLDialogElement) => void;
  onClose?: () => void;
}> = (props) => {
  const vcs = useVcsModal();

  return (
    <ModalMenu dialogRef={props.dialogRef} onClose={props.onClose}>
      <Show when={vcs.branchesWithVersionsMetadata.loading}>
        <LoadingOverlay loadingMessage="Загружаем историю проекта..." />
      </Show>

      <div class="w-275 h-187.5 bg-base-100 rounded-4xl shadow-2xl border border-neutral/20 overflow-hidden flex flex-col select-none">
        <VCSHeader
          currentBranch={vcs.currentBranch}
          activeTab={vcs.activeTab}
          setActiveTab={vcs.setActiveTab}
          viewMode={vcs.viewMode}
          setViewMode={vcs.setViewMode}
        />

        <div class="flex flex-1 overflow-hidden">
          <VCSBranches
            branches={vcs.versionControlStore.branches}
            currentBranch={vcs.currentBranch}
            setCurrentBranch={vcs.setCurrentBranch}
            isCreating={vcs.isCreatingNewBranch}
            setIsCreating={vcs.setIsCreatingNewBranch}
            newName={vcs.newBranchName}
            setNewName={vcs.setNewBranchName}
            onCreate={vcs.createNewBranch}
          />

          <div class="flex-1 bg-base-200/50 flex overflow-hidden">
            <Show when={vcs.activeTab() === "history"}>
              <VCSHistory
                versions={
                  vcs.versionControlStore.versions[
                    vcs.currentBranch()
                  ] || []
                }
                selectedCommit={vcs.selectedCommit}
                setSelectedCommit={vcs.setSelectedCommit}
              />
              <VCSInspector
                selectedCommit={vcs.selectedCommit}
                setSelectedCommit={vcs.setSelectedCommit}
              />
            </Show>

            <Show when={vcs.activeTab() === "conflicts"}>
              <VCSConflicts />
            </Show>
          </div>
        </div>

        <VCSFooter />
      </div>
    </ModalMenu>
  );
};

export default VCSModal;
