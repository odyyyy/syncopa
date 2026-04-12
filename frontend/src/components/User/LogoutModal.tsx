import { Component, onCleanup, onMount, createEffect } from "solid-js";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal: Component<Props> = (props) => {
  let dialogRef: HTMLDialogElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (dialogRef && e.target === dialogRef) {
      props.onClose();
      dialogRef.close();
    }
  };

  onMount(() => {
    dialogRef?.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    dialogRef?.removeEventListener("click", handleClickOutside);
  });

  createEffect(() => {
    if (!dialogRef) return;

    if (props.open) {
      dialogRef.showModal();
    } else {
      if (dialogRef.open) dialogRef.close();
    }
  });

  return (
    <dialog class="modal p-3" ref={dialogRef}>
      <div class="modal-box max-w-3xs flex flex-col items-center">
        <h3 class="text-lg font-bold">Выйти из аккаунта?</h3>

        <div class="modal-action flex justify-between gap-8">
          <button
            class="btn btn-neutral"
            onClick={() => {
              props.onConfirm();
              dialogRef?.close();
            }}
          >
            Да
          </button>

          <button
            class="btn"
            onClick={() => {
              props.onClose();
              dialogRef?.close();
            }}
          >
            Нет
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LogoutModal;