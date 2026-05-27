import { Component, createSignal, Show } from "solid-js";
import CoopModal from "../Coop/CoopModal";
import EffectsModal from "../Effects/EffectsChooseModal";
import VCSModal from "../VCS/VCSModal";
import PresetChooseModal from "../Preset/PresetChooseModal";
import useSwitchPreset from "../../../hooks/daw/preset/useSwitchPreset";

const LowerControlPanel: Component = () => {
  let coopDialogRef!: HTMLDialogElement;
  let effectsDialogRef!: HTMLDialogElement;
  let vcsDialogRef!: HTMLDialogElement;
  let choosePresetRef!: HTMLDialogElement;

  const [isMenuOpen, setIsMenuOpen] = createSignal(true);
  const [isCoopModalOpen, setIsCoopModalOpen] = createSignal(false);
  const [isEffectsModalOpen, setIsEffectsModalOpen] = createSignal(false);
  const [isVCSModalOpen, setIsVCSModalOpen] = createSignal(false);
  const [isChoosePresetOpen, setIsChoosePresetOpen] = createSignal(false);

  const { selectPresetFromModal } = useSwitchPreset();

  return (
    <div>
      <nav class="fixed right-6 bottom-6 z-50 w-20 h-20">
        <div class="relative w-full h-full">
          <div
            class="transition-all duration-300 relative w-full h-full"
            classList={{
              "opacity-0 scale-75 pointer-events-none": !isMenuOpen(),
              "opacity-100 scale-100": isMenuOpen(),
            }}
          >
            <button
              class="absolute bottom-2 right-24 btn btn-md btn-circle border bg-base-200  border-base-content/20 text-base-content hover:bg-base-content/80 hover:text-black shadow-lg tooltip  tooltip-top transition-all"
              data-tip="Коллаборация"
              onClick={() => {
                setIsCoopModalOpen(true);
                coopDialogRef.showModal();
              }}
            >
              <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 stroke-current fill-none"
                stroke-width="1.2"
              >
                <circle cx="5" cy="9" r="2.25" />
                <circle cx="11" cy="4" r="2.25" />
                <path d="M7.75 9.25c0-1 .75-3 3.25-3s3.25 2 3.25 3m-12.5 5c0-1 .75-3 3.25-3s3.25 2 3.25 3" />
              </svg>
            </button>

            <button
              class="absolute bottom-16 right-20 btn btn-md btn-circle border bg-base-200  border-base-content/20 text-base-content hover:bg-base-content/80 hover:text-black  shadow-lg tooltip tooltip-top transition-all"
              data-tip="Система учета изменений"
              onClick={() => {
                setIsVCSModalOpen(true);
                vcsDialogRef.showModal();
              }}
            >
              <svg
                class="w-5 h-5 fill-current"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.507 12.324a7 7 0 0 0 .065-8.56A7 7 0 0 0 2 4.393V2H1v3.5l.5.5H5V5H2.811a6.008 6.008 0 1 1-.135 5.77l-.887.462a7 7 0 0 0 11.718 1.092m-3.361-.97.708-.707L8 7.792V4H7v4l.146.354z"
                />
              </svg>
            </button>

            <button
              class="absolute bottom-24 right-10 btn btn-md btn-circle bg-base-200  border border-base-content/20 text-base-content hover:bg-base-content/80 hover:text-black shadow-lg tooltip tooltip-top transition-all"
              data-tip="Инструменты"
              onClick={() => {
                setIsChoosePresetOpen(true);
                choosePresetRef.showModal();
              }}
            >
              <svg
                viewBox="0 0 32 32"
                version="1.1"
                class="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
              >
                <g id="Icon">
                  <path d="M28.002,7c0,-0.796 -0.316,-1.559 -0.878,-2.121c-0.563,-0.563 -1.326,-0.879 -2.122,-0.879c-4.184,0 -13.818,-0 -18.002,0c-0.796,-0 -1.559,0.316 -2.121,0.879c-0.563,0.562 -0.879,1.325 -0.879,2.121c-0,4.184 -0,13.816 -0,18c-0,0.796 0.316,1.559 0.879,2.121c0.562,0.563 1.325,0.879 2.121,0.879c4.184,0 13.818,0 18.002,0c0.796,0 1.559,-0.316 2.122,-0.879c0.562,-0.562 0.878,-1.325 0.878,-2.121l0,-18Zm-19.002,-1l-2,-0c-0.265,-0 -0.52,0.105 -0.707,0.293c-0.188,0.187 -0.293,0.442 -0.293,0.707l-0,18c-0,0.265 0.105,0.52 0.293,0.707c0.187,0.188 0.442,0.293 0.707,0.293l3.995,0l-0.039,-8l-0.956,0c-0.552,0 -1,-0.448 -1,-1l-0,-11Zm7.997,-0l-1.997,-0l0,11c-0,0.552 -0.448,1 -1,1l-1.044,0l0.039,8l6.005,0l-0.002,-8l-1.001,0c-0.552,0 -1,-0.448 -1,-1l0,-11Zm6,-0l0,11c0,0.552 -0.447,1 -1,1l-0.999,0l0.002,8l4.002,0c0.266,0 0.52,-0.105 0.708,-0.293c0.187,-0.187 0.292,-0.442 0.292,-0.707l0,-18c0,-0.265 -0.105,-0.52 -0.292,-0.707c-0.188,-0.188 -0.442,-0.293 -0.708,-0.293l-2.005,-0Zm-2,-0l-2,-0l0,10c0,0 2,0 2,-0l0,-10Zm-7.997,-0l-2,-0l-0,10c-0,0 2,0 2,-0l0,-10Z" />
                </g>
              </svg>
            </button>

            <button
              class="absolute bottom-29 -right-2 btn btn-md btn-circle bg-base-200  border border-base-content/20 text-base-content hover:bg-base-content/80 hover:text-black shadow-lg tooltip tooltip-top transition-all"
              data-tip="Эффекты"
              onClick={() => {
                setIsEffectsModalOpen(true);
                effectsDialogRef.showModal();
              }}
            >
              <svg
                class="w-5.5 h-5.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 15V9a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M6 15V9h5m-5 3h3.571M13 15l2.5-3m0 0L18 9m-2.5 3L13 9m2.5 3 2.5 3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <div class="absolute bottom-0 right-0 z-10">
            <Show
              when={isMenuOpen()}
              fallback={
                <button
                  class="w-13 h-13 btn btn-circle bg-[#141414] border border-primary/5 text-base-content hover:bg-base-content/80 hover:text-black shadow-xl"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
              }
            >
              <button
                class="w-13 h-13 btn btn-circle bg-[#141414] border-2 border-primary/5 text-base-content hover:bg-base-content/80 hover:text-black shadow-xl text-xl font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </Show>
          </div>
        </div>
      </nav>

      <Show when={isCoopModalOpen()}>
        <CoopModal
          dialogRef={(el) => (coopDialogRef = el)}
          onClose={() => setIsCoopModalOpen(false)}
        />
      </Show>
      <Show when={isEffectsModalOpen()}>
        <EffectsModal
          dialogRef={(el) => (effectsDialogRef = el)}
          onClose={() => setIsEffectsModalOpen(false)}
        />
      </Show>
      <Show when={isVCSModalOpen()}>
        <VCSModal
          dialogRef={(el) => (vcsDialogRef = el)}
          onClose={() => setIsVCSModalOpen(false)}
        />
      </Show>
      <Show when={isChoosePresetOpen()}>
        <PresetChooseModal
          dialogRef={(el) => (choosePresetRef = el)}
          onSelect={(presetId) => {
            selectPresetFromModal(presetId);
            setIsChoosePresetOpen(false);
          }}
        />
      </Show>
    </div>
  );
};

export default LowerControlPanel;
