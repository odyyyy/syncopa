import { Component, JSX, onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = {
  dialogRef?: (el: HTMLDialogElement) => void;
  onClose?: (returnValue: string) => void;
  children: JSX.Element;
  class?: string;
};

const ModalMenu: Component<ModalProps> = (props) => {
  let dialog!: HTMLDialogElement;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialog) {
      dialog.close();
    }
  };

  const handleClose = () => {
    props.onClose?.(dialog.returnValue);
    dialog.returnValue = "";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      dialog.close();
    }
  };

  onMount(() => {
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("close", handleClose);
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    dialog.removeEventListener("click", handleBackdropClick);
    dialog.removeEventListener("close", handleClose);
    window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Portal>
      <dialog
        ref={(el) => {
          dialog = el;
          props.dialogRef?.(el);
        }}
        class={`modal backdrop:bg-black/40 transition-opacity duration-300 ${props.class ?? ""}`}
      >
        {props.children}
      </dialog>
    </Portal>
  );
};

export default ModalMenu;