import { Accessor, Setter } from "solid-js";
import * as Tone from "tone";

type Note = `${"A" | "B" | "C" | "D" | "E" | "F" | "G"}${"" | "#"}${number}`;

type SamplePath = `${string}.${"mp3" | "wav" | "ogg"}`;

type Sample = Record<Note, SamplePath>;

type PresetType = "sampler" | "synth";

type Preset = {
  id: number;
  title: string;
  description: string;
  category: string;
  previewSound?: SamplePath;
};

type PresetWithConfig = {
  preset: Preset;
  preset_config: PresetConfig;
};

type PresetConfig = {
  type: PresetType;
  config: Sampler | Synth;
};

type PresetConfigOut = {
  id: number;
  preset_config: PresetConfig;
};

type Sampler = {
  samplesUrls: Sample;
  samplesDir: string;
  volume?: number;
  release?: number;
  attack?: number;
  curve?: "linear" | "exponential";
};

type Synth = {
  oscilators: Oscillator[];
  envelope: Envelope;
  filter?: Filter;
  filter_envelope?: FilterEnvelope;
  gain?: number;
  effects?: Effect[];
};

type Oscillator = {
  type: "sine" | "sawtooth" | "square" | "triangle";
  frequency: number;
  detune?: number;
  volume?: number;
  specific_oscillator?: SpecificOscillator;
};

type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type FilterEnvelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  baseFrequency?: number;
  octaves?: number;
};

type Filter = {
  type: "lowpass" | "highpass" | "bandpass" | "notch";
  frequency: number;
  q?: number;
  rolloff?: number;
};

type SpecificOscillator = {
  type: "fat" | "fm" | "am";
  params: Record<string, any>;
};

type LFOConfig = {
  type: "lfo";
  frequency: number;
  min: number;
  max: number;
  target: "filter.frequency" | "osc1.detune" | "osc2.detune" | "amp.gain";
};

type DistortionConfig = {
  type: "distortion";
  amount: number;
};

type ReverbConfig = {
  type: "reverb";
  decay: number;
  wet: number;
};

type DelayConfig = {
  type: "delay";
  time: number;
  feedback: number;
  wet: number;
};

type Effect = LFOConfig | DistortionConfig | ReverbConfig | DelayConfig;

type PresetModalState = {
  trackId?: string;
  presetId?: number;
};

type PresetsContextType = {
  presets: Preset[];
  presetModalState: Accessor<PresetModalState>;
  setPresetModalState: Setter<PresetModalState>;
  setAndLoadSelectedPreset: (presetId: number, trackId: string) => void;
  isPresetLoading: Accessor<boolean>;
  setIsPresetLoading: Setter<boolean>;
  updatePreset: (presetId: number, trackId: string) => void;
};

type Voice = {
  oscillators: (Tone.Oscillator | Tone.FatOscillator)[];
  filter?: Tone.Filter;
  ampEnv: Tone.AmplitudeEnvelope;
  filterEnv?: Tone.FrequencyEnvelope;
  output: Tone.Gain;
  active: boolean;
};

interface PolySynthInstance {
  triggerAttackRelease: (
    note: string,
    duration: number,
    time?: number,
    velocity?: number,
  ) => void;
  dispose: () => void;
  config: Synth;
  type: "polySynth",
  setVolume: (v: number) => void;
}

interface PresetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

type SamplerWithUrls= Tone.Sampler & {
  samplesUrls: Record<string, string>;
}

export type {
  PresetWithConfig,
  Preset,
  PresetCategory,
  Note,
  SamplePath,
  Sample,
  PresetType,
  PresetConfig,
  PresetConfigOut,
  Synth,
  Oscillator,
  Envelope,
  Filter,
  SpecificOscillator,
  LFOConfig,
  DistortionConfig,
  ReverbConfig,
  DelayConfig,
  PresetsContextType,
  Voice,
  PresetModalState,
  Sampler,
  PolySynthInstance,
  SamplerWithUrls,
};
