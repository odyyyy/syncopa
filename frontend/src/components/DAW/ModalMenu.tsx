import { Component, JSX, onMount, onCleanup, createSignal } from "solid-js";

type ModalProps = {
  dialogRef?: (el: HTMLDialogElement) => void;
  onClose?: (returnValue: string) => void;
  children: JSX.Element;
  class?: string;
};

const ModalMenu: Component<ModalProps> = (props) => {
  let dialog!: HTMLDialogElement;
  const [isClosing, setIsClosing] = createSignal(false);

  const stopKeyboardPropagation = (e: KeyboardEvent) => {
    e.stopPropagation();
  };

  const patchShowModal = (el: HTMLDialogElement) => {
    const originalShow = el.showModal.bind(el);
    el.showModal = () => {
      setIsClosing(false);
      originalShow();
    };
  };

  const closeWithAnimation = () => {
    if (isClosing() || !dialog.open) return;
    setIsClosing(true);
    setTimeout(() => {
      if (dialog.open) dialog.close();
    }, 200);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialog) closeWithAnimation();
  };

  const handleCancel = (e: Event) => {
    e.preventDefault();
    closeWithAnimation();
  };

  const handleClose = () => {
    props.onClose?.(dialog.returnValue);
  };

  onMount(() => {
    patchShowModal(dialog);
    dialog.addEventListener("keydown", stopKeyboardPropagation);
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
  });

  onCleanup(() => {
    dialog.removeEventListener("keydown", stopKeyboardPropagation);
    dialog.removeEventListener("click", handleBackdropClick);
    dialog.removeEventListener("cancel", handleCancel);
    dialog.removeEventListener("close", handleClose);
  });

  return (
    <dialog
      ref={(el) => {
        dialog = el;
        props.dialogRef?.(el);
      }}
      tabIndex="-1"
      class={`modal backdrop:bg-black/70 backdrop:backdrop-blur-sm transition-all duration-300 ease-out ${
        isClosing() ? "opacity-0 scale-95" : "opacity-100 scale-100"
      } ${props.class ?? ""}`}
    >
      <div
        class="modal-box p-0 max-w-none w-auto bg-transparent shadow-none outline-none overflow-visible"
        onKeyDown={(e) => e.stopPropagation()}
      >
        {props.children}
      </div>
    </dialog>
  );
};

export default ModalMenu;
