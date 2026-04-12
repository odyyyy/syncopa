import { Component, createSignal, For } from "solid-js";
import ModalMenu from "../ModalMenu";
import { AudioKnob } from "./AudioKnob";

type Pattern = { id: string; name: string };

const FX_DATA = {
  REVERB: { id: "rev", name: "Reverb", params: [
    { label: "Decay", min: 0.1, max: 10, unit: "s", default: 2.5 },
    { label: "Mix", min: 0, max: 100, unit: "%", default: 30 },
    { label: "Size", min: 0, max: 1, unit: "", default: 0.5 },
    { label: "Damp", min: 0, max: 20000, unit: "Hz", default: 5000 }
  ]},
  DELAY: { id: "dly", name: "Delay", params: [
    { label: "Feedback", min: 0, max: 95, unit: "%", default: 40 },
    { label: "Time", min: 1, max: 16, unit: "/16", default: 4 },
    { label: "Mix", min: 0, max: 100, unit: "%", default: 20 },
    { label: "Width", min: 0, max: 100, unit: "%", default: 80 }
  ]}
};

type EffectsModalProps = {
  dialogRef: (el: HTMLDialogElement) => void;
  availablePatterns?: Pattern[];
};

const EffectsModal: Component<EffectsModalProps> = (props) => {
  const [targetPatternId, setTargetPatternId] = createSignal("");
  const [selectedFx, setSelectedFx] = createSignal(FX_DATA.REVERB);
  const [knobValues, setKnobValues] = createSignal<Record<string, number>>({
    "Decay": 2.5, "Mix": 30, "Size": 0.5, "Damp": 5000,
    "Feedback": 40, "Time": 4, "Width": 80
  });

  const updateValue = (label: string, val: number) => {
    setKnobValues(prev => ({ ...prev, [label]: val }));
  };

  return (
    <ModalMenu dialogRef={props.dialogRef}>
      <div class="w-175 bg-base-200 rounded-3xl shadow-2xl border border-neutral/30 overflow-hidden flex flex-col select-none">
        
        <div class="p-6  bg-base-200/65 flex items-center justify-between border-b border-black/20">
          <h2 class="text-2xl font-black uppercase tracking-wider text-base-content">
            Эффекты
          </h2>
          
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black uppercase opacity-40">Назначить:</span>
            <select 
              class="select select-bordered select-sm bg-base-100 rounded-lg font-bold text-xs focus:outline-none"
              value={targetPatternId()}
              onChange={(e) => setTargetPatternId(e.currentTarget.value)}
            >
              <option value="" disabled selected>Выбрать паттерн...</option>
              <For each={props.availablePatterns}>
                {(p) => <option value={p.id}>{p.name}</option>}
              </For>
            </select>
          </div>
        </div>

        <div class="flex flex-1 min-h-87.5">
          <div class="w-20  bg-base-200/90 border-r border-black/10 flex flex-col items-center py-8 gap-6">
            <For each={Object.values(FX_DATA)}>
              {(fx) => (
                <button
                  onClick={() => setSelectedFx(fx)}
                  class={`size-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                    selectedFx().id === fx.id 
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--p),0.2)]" 
                      : "bg-base-300 border-transparent opacity-30 hover:opacity-100"
                  }`}
                >
                  <span class="font-black text-[10px]">{fx.name.substring(0, 3).toUpperCase()}</span>
                </button>
              )}
            </For>
          </div>

          <div class="flex-1 bg-base-300/5 p-10">
            <div class="mb-10">
              <h3 class="text-4xl font-black italic tracking-tighter uppercase text-base-content leading-none">
                {selectedFx().name}
              </h3>
              <div class={`h-1 w-15 bg-primary mt-2`} />
            </div>

            <div class="grid grid-cols-4 gap-10">
              <For each={selectedFx().params}>
                {(param) => (
                  <AudioKnob
                    label={param.label}
                    min={param.min}
                    max={param.max}
                    unit={param.unit}
                    value={knobValues()[param.label] ?? param.default}
                    onChange={(val) => updateValue(param.label, val)}
                  />
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="p-6 bg-base-200/55 border-t border-black/10 flex justify-end items-center gap-4">

          <button 
            disabled={!targetPatternId()}
            class="btn btn-primary px-10 rounded-xl font-black  tracking-wide shadow-lg  active:scale-95 transition-all"
          >
            Применить
          </button>
        </div>
      </div>
    </ModalMenu>
  );
};

export default EffectsModal;