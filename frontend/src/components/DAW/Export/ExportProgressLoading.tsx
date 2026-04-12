import { createEffect, createSignal, onCleanup, onMount, Setter, Show } from "solid-js";
import { Portal } from "solid-js/web";
import useExportProject from "../../../hooks/daw/export/useExport";

const ExportProgressLoading = (props: {
  open: boolean;
  onClose: () => void;
}) => {
  let dialogRef!: HTMLDialogElement;
  const [exportLoadingProgress, setExportLoadingProgress] = createSignal(0);
  const { exportProjectAudio } = useExportProject();
  
  const loadingInterval = setInterval(() => {
    if (exportLoadingProgress() < 99) {
      setExportLoadingProgress((prev) => prev + 1);
    }
  }, 10);

  createEffect(() => {
    if (props.open && !dialogRef.open) {
      dialogRef.showModal();
    }

    if (!props.open && dialogRef.open) {
      dialogRef.close();
    }
  });

  onMount(async () => {
    await exportProjectAudio();
    setExportLoadingProgress(100);
    setTimeout(() => {
      props.onClose();
    }, 1000);
    
  });

  onCleanup(() => {
    clearInterval(loadingInterval);
  });

  return (
    <Portal>
      <dialog ref={dialogRef} class="modal ">
        <div class="w-70 h-65 rounded-2xl flex flex-col gap-5 bg-base-200 justify-center items-center">
          <p class="text-lg text-base-content ">Загружаем проект...</p>
          <div class="relative inline-flex items-center justify-center">
            <svg class="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                class="stroke-primary/10"
                stroke-width="8"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-dasharray="351.858"
                stroke-dashoffset={351.858 - (exportLoadingProgress() / 100) * 351.858}
                stroke-linecap="round"
              />
            </svg>
            <span class="absolute text-xl font-bold text-base-content">
              {Math.round(exportLoadingProgress())}%
            </span>
          </div>
        </div>
      </dialog>
    </Portal>
  );
};

export default ExportProgressLoading;
