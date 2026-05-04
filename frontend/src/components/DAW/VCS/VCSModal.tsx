import { Component, Show } from "solid-js";
import ModalMenu from "../ModalMenu";
import useVcsModal from "@/hooks/daw/vcs/useVcsModal";
import LoadingOverlay from "@/components/utils/Loaders/LoadingOverlay";
import SwitchToVCSModeModal from "../../utils/ConfirmActionModal";

import VCSBranches from "./VCSBranches";
import VCSInspector from "./VCSInspector";
import VCSFooter from "./VCSFooter";
import VCSHeader from "./VCSHeader";
import VCSBranchHistory from "./VCSBranchHistory";
import VCSConflicts from "./VCSConflicts";
import useSwitchToVcsWarningModal from "@/hooks/daw/vcs/useSwitchToVcsWarningModal";
import toast from "solid-toast";
import VCSWholeProjectHistory from "./VCSWholeProjectHistory";

const VCSModal: Component<{
  dialogRef: (el: HTMLDialogElement) => void;
  onClose?: () => void;
}> = (props) => {
  const vcs = useVcsModal();
  const {
    isSwitchModeWarningOpen,
    setIsSwitchModeWarningOpen,
    confirmAction,
    openSwitchModal,
  } = useSwitchToVcsWarningModal();

  return (
    <ModalMenu dialogRef={props.dialogRef} onClose={props.onClose}>
      <Show when={vcs.branchesWithVersionsMetadata.loading || vcs.vcsLoading()}>
        <LoadingOverlay loadingMessage="Загружаем историю проекта..." />
      </Show>

      <div class="w-275 h-187.5 bg-base-100 rounded-4xl shadow-2xl border border-neutral/20 overflow-hidden flex flex-col select-none">
        <VCSHeader
          selectedBranchInModal={vcs.selectedBranchInModal}
          activeTab={vcs.activeTab}
          setActiveTab={vcs.setActiveTab}
          viewMode={vcs.viewMode}
          setViewMode={vcs.setViewMode}
        />

        <div class="flex flex-1 overflow-hidden">
          <VCSBranches
            branches={vcs.versionControlStore.branches}
            selectedBranchInModal={vcs.selectedBranchInModal}
            setSelectedBranchInModal={vcs.setSelectedBranchInModal}
            isCreating={vcs.isCreatingNewBranch}
            setIsCreating={vcs.setIsCreatingNewBranch}
            newName={vcs.newBranchName}
            setNewName={vcs.setNewBranchName}
            onCreate={vcs.createNewBranch}
            currentVersionBranch={vcs.VCSState.currentVersion?.branch}
          />

          <div class="flex-1 bg-base-200/50 flex overflow-hidden">
            <Show when={vcs.activeTab() === "history"}>
              <Show when={vcs.viewMode() === "all"}>
                <VCSWholeProjectHistory
                  branches={vcs.versionControlStore.branches}
                  versionsRecord={vcs.versionControlStore.versions}
                  selectedVersion={vcs.selectedVersion}
                  setSelectedVersion={vcs.setSelectedVersion}
                />
              </Show>

              <Show when={vcs.viewMode() === "branch"}>
                <VCSBranchHistory
                  versions={
                    vcs.versionControlStore.versions[
                      vcs.selectedBranchInModal()
                    ] || []
                  }
                  selectedVersion={vcs.selectedVersion}
                  setSelectedVersion={vcs.setSelectedVersion}
                />
     
              </Show>
              <VCSInspector
                selectedVersion={vcs.selectedVersion}
                setSelectedVersion={vcs.setSelectedVersion}
                setVCSState={vcs.setVCSState}
                loadSelectedVersion={vcs.loadSelectedVersion}
                setVcsLoading={vcs.setVcsLoading}
                openSwitchModal={openSwitchModal}
              />
            </Show>

            <Show when={vcs.activeTab() === "conflicts"}>
              <VCSConflicts />
            </Show>
          </div>
        </div>

        <VCSFooter
          commitVersion={vcs.commitVersion}
          openSwitchModal={openSwitchModal}
        />
      </div>

      <Show when={isSwitchModeWarningOpen()}>
        <SwitchToVCSModeModal
          title="ВНИМАНИЕ!"
          description="Совершая данное действие, вы переходите в режим работы с системой контроля версий. Вы будете отключены от текущей сессии совместной работы, а все незафиксированные изменения в режиме работы с системой контроля версий будут безвозвратно утеряны. Вы хотите продолжить?"
          confirmText="Продолжить"
          cancelText="Отмена"
          type="warning"
          open={isSwitchModeWarningOpen()}
          onClose={() => setIsSwitchModeWarningOpen(false)}
          onConfirm={async () => {
            vcs.setVcsLoading(true);
            setIsSwitchModeWarningOpen(false);

            vcs.websocketConnection?.close();

            if (confirmAction()) {
              await confirmAction()!();
            }

            vcs.setVCSState("isVCSModeActive", true);
            vcs.setVcsLoading(false);
            toast.success("Действие выполнено успешно");
          }}
        />
      </Show>
    </ModalMenu>
  );
};

export default VCSModal;
