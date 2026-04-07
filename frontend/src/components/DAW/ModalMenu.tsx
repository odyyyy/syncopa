import { Component, JSX, onMount, onCleanup, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = {
  dialogRef?: (el: HTMLDialogElement) => void;
  onClose?: (returnValue: string) => void;
  children: JSX.Element;
  class?: string;
};

const ModalMenu: Component<ModalProps> = (props) => {
  let dialog!: HTMLDialogElement;
  const [isClosing, setIsClosing] = createSignal(false);

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
      if (dialog.open) {
        dialog.close();
      }
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
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
  });

  onCleanup(() => {
    dialog.removeEventListener("click", handleBackdropClick);
    dialog.removeEventListener("cancel", handleCancel);
    dialog.removeEventListener("close", handleClose);
  });

  return (
    <Portal>
      <dialog
        ref={(el) => {
          dialog = el;
          props.dialogRef?.(el);
        }}
        class={`modal backdrop:bg-black/70 backdrop:backdrop-blur-sm transition-all duration-200 ease-out ${
          isClosing()
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        } ${props.class ?? ""}`}
      >
        <div class="outline-none" onClick={(e) => e.stopPropagation()}>
          {props.children}
        </div>
      </dialog>
    </Portal>
  );
};

export default ModalMenu;
