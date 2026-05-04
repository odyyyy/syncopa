import { useVCSContext } from "@/context/vcs/vcs.context";
import { createSignal } from "solid-js";
import toast from "solid-toast";

const useSwitchToVcsWarningModal = () => {
  const [isSwitchModeWarningOpen, setIsSwitchModeWarningOpen] = createSignal(false);
  const [confirmAction, setConfirmAction] = createSignal<null | (() => Promise<void> | void)>(null);
  const { VCSState } = useVCSContext();
  
  const openSwitchModal =  async(callback: () => Promise<void> | void) => {
    if (VCSState.isVCSModeActive) {
      try {
        await callback()
      } catch (error) {
        return;
      }
      toast.success("Действие выполнено успешно");
      return;
    }
    setConfirmAction(() => callback);
    setIsSwitchModeWarningOpen(true);
  };

  return {
    isSwitchModeWarningOpen,
    openSwitchModal,
    confirmAction, setIsSwitchModeWarningOpen
  };
};

export default useSwitchToVcsWarningModal;