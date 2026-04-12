import { Component, onCleanup, onMount, createEffect } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmActionModal: Component<Props> = (props) => {
  let dialogRef!: HTMLDialogElement;

  const handleCancel = (e: Event) => {
    e.preventDefault();
    props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
  };

  onMount(() => {
    dialogRef.addEventListener("cancel", handleCancel);
    dialogRef.addEventListener("click", handleBackdropClick);
  });

  onCleanup(() => {
    dialogRef.removeEventListener("cancel", handleCancel);
    dialogRef.removeEventListener("click", handleBackdropClick);
  });

  createEffect(() => {
    if (props.open && !dialogRef.open) {
      dialogRef.showModal();
    }

    if (!props.open && dialogRef.open) {
      dialogRef.close();
    }
  });

  return (
    <Portal>
      <dialog ref={dialogRef} class="modal">
        <div class="modal-box max-w-3xs flex flex-col items-center text-center">
          <h3 class="text-lg font-bold">{props.title}</h3>

          <div class="modal-action flex justify-between gap-8">
            <button class="btn btn-neutral" onClick={props.onConfirm}>
              Да
            </button>

            <button class="btn" onClick={props.onClose}>
              Нет
            </button>
          </div>
        </div>
      </dialog>
    </Portal>
  );
};

export default ConfirmActionModal;
