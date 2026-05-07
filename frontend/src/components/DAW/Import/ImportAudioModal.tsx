import { Component, createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import useImportAudio from "../../../hooks/daw/import/useImportAudio";
import toast from "solid-toast";
import { useCoopContext } from "@/context/coop/coopsession.context";
import { useSendChangeEvent } from "@/coop/handleCoopEvents";
import { SyncOperation, Target } from "@/types/coop.types";

const ImportAudioModal: Component<{
  open: boolean;
  onClose: () => void;
}> = (props) => {
  let dialogRef!: HTMLDialogElement;
  let audioInputRef!: HTMLInputElement;
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);

  const { addImportedAudioPatternInAudioTrack } = useImportAudio();
  const { sendChangeEvent } = useSendChangeEvent();

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
  };

  const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleImport = async () => {
    if (selectedFile()) {
      const importedAudioPattern = await addImportedAudioPatternInAudioTrack(
        selectedFile()!,
      );
      if (!importedAudioPattern) {
        toast.error("Ошибка при импорте аудио-файла");
        throw new Error("Ошибка при импорте аудио-файла");
      } else {
        sendChangeEvent(SyncOperation.CREATE, Target.PATTERN, {
          type: "audio",
          audioPattern: importedAudioPattern.audioPattern,
          trackId: importedAudioPattern.trackId,
        });
      }
    }
    props.onClose();
  };

  createEffect(() => {
    if (props.open && !dialogRef.open) {
      dialogRef.showModal();
    }

    if (!props.open && dialogRef.open) {
      dialogRef.close();
      setSelectedFile(null);
      if (audioInputRef) audioInputRef.value = "";
    }
  });

  return (
    <Portal>
      <dialog ref={dialogRef} class="modal" onClick={handleBackdropClick}>
        <div class="modal-box bg-linear-to-br from-base-200 to-base-100 rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-visible">
          <fieldset class="fieldset bg-linear-to-br from-base-200 to-base-100 p-8 rounded-2xl shadow-2xl">
            <legend class="fieldset-legend text-2xl font-bold bg-linear-to-r from-base-content to-base-content/80 bg-clip-text text-transparent mb-4">
              🎵 Импорт аудио
            </legend>

            <div class="space-y-6">
              <div class="relative">
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/mp3, audio/wav, audio/ogg"
                  onChange={handleFileChange}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    audioInputRef.classList.add(
                      "scale-105",
                      "border-dashed",
                      "border-primary",
                      "bg-primary/10",
                    );
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    audioInputRef.classList.remove(
                      "scale-105",
                      "border-dashed",
                      "border-primary",
                      "bg-primary/10",
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    audioInputRef.classList.remove(
                      "scale-105",
                      "border-dashed",
                      "border-primary",
                      "bg-primary/10",
                    );
                    const file = e.dataTransfer?.files[0];
                    if (file && file.type.startsWith("audio/")) {
                      setSelectedFile(file);

                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      audioInputRef.files = dataTransfer.files;
                    }
                  }}
                  class="file-input border-dashed outline-none w-full bg-base-200 h-28 text-lg border-2 border-base-300 focus:border-primary transition-all duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary-focus"
                />
              </div>

              <label class="label justify-center gap-2 text-sm text-base-content/70">
                <span>📁 Поддерживаемые форматы: MP3, WAV, OGG</span>
              </label>

              <label class="label text-center text-xs text-warning gap-1">
                <span>⚠️ Максимальный размер: 5 МБ</span>
              </label>

              <div class="flex gap-3 pt-4">
                <button
                  onClick={props.onClose}
                  class="btn btn-ghost flex-1 text-base-content/70 hover:bg-base-300"
                >
                  Отмена
                </button>
                <button
                  onClick={handleImport}
                  disabled={!selectedFile()}
                  class="btn btn-primary flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Добавить
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </dialog>
    </Portal>
  );
};

export default ImportAudioModal;
