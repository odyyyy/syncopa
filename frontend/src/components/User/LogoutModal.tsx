import { Component, onCleanup, onMount, createEffect } from "solid-js";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal: Component<Props> = (props) => {
  let modalRef: HTMLDialogElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef && e.target === modalRef) {
      props.onClose();
      modalRef.close();
    }
  };

  onMount(() => {
    modalRef?.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    modalRef?.removeEventListener("click", handleClickOutside);
  });

  createEffect(() => {
    if (!modalRef) return;

    if (props.open) {
      modalRef.showModal();
    } else {
      if (modalRef.open) modalRef.close();
    }
  });

  return (
    <dialog class="modal p-3" ref={modalRef}>
      <div class="modal-box max-w-3xs flex flex-col items-center">
        <h3 class="text-lg font-bold">Выйти из аккаунта?</h3>

        <div class="modal-action flex justify-between gap-8">
          <button
            class="btn btn-neutral"
            onClick={() => {
              props.onConfirm();
              modalRef?.close();
            }}
          >
            Да
          </button>

          <button
            class="btn"
            onClick={() => {
              props.onClose();
              modalRef?.close();
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