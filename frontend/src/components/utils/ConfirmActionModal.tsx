import { Component, onCleanup, onMount, createEffect, Show, mergeProps } from "solid-js";
import { Portal } from "solid-js/web";

type ModalType = "info" | "warning" | "danger";

type Props = {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  icon?: any;
};

const ConfirmActionModal: Component<Props> = (rawProps) => {
  const props = mergeProps({ confirmText: "Да", cancelText: "Нет", type: "info" as ModalType }, rawProps);
  let dialogRef!: HTMLDialogElement;

  const handleCancel = (e: Event) => {
    e.preventDefault();
    props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef) props.onClose();
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
    if (props.open && !dialogRef.open) dialogRef.showModal();
    if (!props.open && dialogRef.open) dialogRef.close();
  });

  const accentClass = () => {
    switch (props.type) {
      case "danger": return "text-error";
      case "warning": return "text-warning";
      default: return "text-neutral";
    }
  };

  return (
    <Portal>
      <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle transition-all">
        <div class="modal-box max-w-md p-0 overflow-hidden rounded-2xl border border-base-content/5 shadow-2xl">
          <div class={`h-1.5 w-full ${props.type === 'warning' ? 'bg-warning' : props.type === 'danger' ? 'bg-error' : 'bg-primary'}`} />
          
          <div class="p-6 flex flex-col items-center text-center">
            <Show when={props.icon}>
              <div class={`mb-4 p-3 rounded-full bg-base-200 ${accentClass()}`}>
                {props.icon}
              </div>
            </Show>

            <h3 class={`text-xl font-black mb-2 ${accentClass()}`}>
              {props.title}
            </h3>

            <Show when={props.description}>
              <p class="text-sm text-base-content/70 leading-relaxed mb-6">
                {props.description}
              </p>
            </Show>

            <div class="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button 
                class="btn flex-1 order-2 sm:order-1" 
                onClick={props.onClose}
              >
                {props.cancelText}
              </button>
              <button 
                class={`btn flex-1 order-1 sm:order-2 ${props.type === 'warning' ? 'btn-warning' : props.type === 'danger' ? 'btn-error' : 'btn-primary'}`} 
                onClick={props.onConfirm}
              >
                {props.confirmText}
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button onClick={props.onClose}>close</button>
        </form>
      </dialog>
    </Portal>
  );
};

export default ConfirmActionModal;