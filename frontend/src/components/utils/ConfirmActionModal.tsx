import { Component, onCleanup, onMount, createEffect } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmActionModal: Component<Props> = (props) => {
  let modalRef!: HTMLDialogElement;

  const handleCancel = (e: Event) => {
    e.preventDefault();
    props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === modalRef) {
      props.onClose();
    }
  };

  onMount(() => {
    modalRef.addEventListener("cancel", handleCancel);
    modalRef.addEventListener("click", handleBackdropClick);
  });

  onCleanup(() => {
    modalRef.removeEventListener("cancel", handleCancel);
    modalRef.removeEventListener("click", handleBackdropClick);
  });

  createEffect(() => {
    if (props.open && !modalRef.open) {
      modalRef.showModal();
    }

    if (!props.open && modalRef.open) {
      modalRef.close();
    }
  });

  return (
    <Portal>
      <dialog ref={modalRef} class="modal">
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
