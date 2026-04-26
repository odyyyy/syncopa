import {
  Component,
  createSignal,
  For,
  createMemo,
  createEffect,
  Show,
  onCleanup,
  onMount,
} from "solid-js";
import ModalMenu from "../ModalMenu";
import { AudioKnob } from "./AudioKnob";
import { useProjectContext } from "@/context/daw/project.context";
import useEffectsManager, {
  FX_DATA,
} from "@/hooks/daw/effect/useEffectsManager";
import { batch } from "solid-js";

const EffectsModal: Component<{
  dialogRef: (el: HTMLDialogElement) => void;
}> = (props) => {
  let dialog!: HTMLDialogElement;

  const [targetPatternId, setTargetPatternId] = createSignal("");
  const [selectedFx, setSelectedFx] = createSignal(FX_DATA.REVERB);
  const { tracks } = useProjectContext();
  const {
    applyEffectToPattern,
    removeEffectFromPattern,
    createEffectParamsStore,
  } = useEffectsManager();
  const { effectParams, setEffectParams } = createEffectParamsStore();

  const availablePatterns = createMemo(() =>
    tracks.flatMap((track) => track.patterns || [])
  );

  const currentPattern = createMemo(() => {
      const id = targetPatternId();
      if (!id) return undefined;
      return availablePatterns().find((p) => p.patternId === id);
    });

  const appliedEffectData = createMemo(() =>
    currentPattern()?.effects?.find((e) => e.type === selectedFx().id),
  );

  const close = () => {
    if (!dialog) return;
    dialog.close();
  };

  const stopBackdropClose = (e: MouseEvent) => {
    if (e.target === dialog) {
      e.stopImmediatePropagation();
    }
  };

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  createEffect(() => {
    const data = appliedEffectData();
    const fx = selectedFx();

    batch(() => {
      if (data) {
        const syncedValues: Record<string, number> = {};
        fx.params.forEach((p) => {
          syncedValues[p.key] = (data as any)[p.key] ?? p.default;
        });
        setEffectParams((prev) => ({ ...prev, ...syncedValues }));
      } else {
        const defaults: Record<string, number> = {};
        fx.params.forEach((p) => (defaults[p.key] = p.default));
        setEffectParams((prev) => ({ ...prev, ...defaults }));
      }
    });
  });

  onMount(() => {
    dialog.addEventListener("click", stopBackdropClose, true);
    window.addEventListener("keydown", handleEsc);
  });

  onCleanup(() => {
    dialog.removeEventListener("click", stopBackdropClose, true);
    window.removeEventListener("keydown", handleEsc);
  });

  return (
    <ModalMenu
      dialogRef={(el) => {
        dialog = el;
        props.dialogRef(el);
      }}
    >
      <div class="w-175 bg-base-200 rounded-3xl shadow-2xl border border-neutral/30 overflow-hidden flex flex-col select-none">
        <div class="p-6 bg-base-200/65 flex items-center justify-between border-b border-black/20">
          <h2 class="text-2xl font-black uppercase tracking-wider text-base-content">
            Эффекты
          </h2>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black uppercase opacity-40">
              Назначить:
            </span>
            <select
              class="select select-bordered select-sm bg-base-100 rounded-lg font-bold text-xs focus:outline-none"
              itemprop={targetPatternId()} 
              onChange={(e) => setTargetPatternId(e.currentTarget.value)}
            >
              <Show when={!targetPatternId()}>
                <option value="" disabled selected>
                  Выбрать паттерн...
                </option>
              </Show>
              <For each={availablePatterns()}>
                {(p) => (
                  <option 
                    value={p.patternId} 
                    selected={p.patternId === targetPatternId()}
                  >
                    {p.title}
                  </option>
                )}
              </For>
            </select>
            <button
              onClick={close}
              class="btn btn-sm btn-circle btn-ghost text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="flex flex-1 min-h-87.5">
          <div class="w-20 bg-base-200/90 border-r border-black/10 flex flex-col items-center py-8 gap-6">
            <For each={Object.values(FX_DATA)}>
              {(fx) => (
                <button
                  onClick={() => setSelectedFx(fx)}
                  class={`relative size-12 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                    selectedFx().id === fx.id
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--p),0.2)]"
                      : "bg-base-300 border-transparent opacity-30 hover:opacity-100"
                  }`}
                >
                  <Show
                    when={currentPattern()?.effects?.some(
                      (e) => e.type === fx.id,
                    )}
                  >
                    <span class="absolute -top-1 -right-1 flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  </Show>
                  <span class="font-black text-[10px]">
                    {fx.name.substring(0, 3).toUpperCase()}
                  </span>
                </button>
              )}
            </For>
          </div>

          <div class="flex-1 bg-base-300/5 p-10">
            <div class="mb-10 flex items-end justify-between">
              <div>
                <h3 class="text-4xl font-black italic tracking-tighter uppercase text-base-content leading-none">
                  {selectedFx().name}
                </h3>
                <div class="h-1 w-15 bg-primary mt-2" />
              </div>

              <Show when={!!appliedEffectData()}>
                <button
                  onClick={() =>
                    removeEffectFromPattern(targetPatternId(), selectedFx().id)
                  }
                  class="text-[10px] font-black uppercase px-3 py-2 bg-error/10 text-error rounded-xl border border-error/20 hover:bg-error hover:text-white transition-all cursor-pointer tracking-widest"
                >
                  Удалить эффект
                </button>
              </Show>
            </div>

            <div class="grid grid-cols-3 gap-10">
              <For each={selectedFx().params}>
                {(param) => (
                  <AudioKnob
                    label={param.label}
                    min={param.min}
                    max={param.max}
                    unit={param.unit}
                    value={effectParams()[param.key] ?? param.default}
                    onChange={(val) =>
                      setEffectParams((prev) => ({ ...prev, [param.key]: val }))
                    }
                  />
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="p-6 bg-base-200/55 border-t border-black/10 flex justify-end">
          <button
            onclick={() => {
              applyEffectToPattern(targetPatternId(), {
                type: selectedFx().id,
                ...effectParams(),
              });
            }}
            disabled={!targetPatternId()}
            class="btn btn-primary opacity-90 px-10 rounded-xl font-black tracking-wide shadow-lg active:scale-95 transition-all"
          >
            {!!appliedEffectData() ? "Обновить" : "Применить эффект"}
          </button>
        </div>
      </div>
    </ModalMenu>
  );
};

export default EffectsModal;
