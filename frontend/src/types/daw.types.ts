import { Accessor, JSX, Resource, Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { Effect } from "./presets.types";

type ProjectWithPayload = {
  projectId: string;
  title: string;
  ownerId: string;
  invitedMembers: ProjectMember[];
  payload: ProjectPayload;
};

type ProjectPayload = {
  metadata?: PayloadMetadata;
  tracks: Track[];
};

type PayloadMetadata = {
  bpm: number;
  totalVolume: number;
};

type Track = {
  trackId: string;
  title: string;
  volume: number;
  presetId: number;
  patterns: PatternType[] | null;
};

type BasePattern = {
  patternId: string;
  title: string;
  pos: number;
  width: number;
  type: "audio" | "vst";
  effects?: Effect[];
};

type PatternVST = BasePattern & {
  type: "vst";
  notes: Note[] | [];
};

type PatternAudio = BasePattern & {
  type: "audio";
  audioMetadata: AudioClipMetadata;
};

type PatternType = PatternVST | PatternAudio;

type Note = {
  noteId: string;
  pos: number;
  note: string;
  duration: number;
  velocity: number;
};

type AudioClipMetadata = {
  duration: number;
  sampleRate: number;
  channelsNumber: number;
};

type PatternAudioLoaded = {
  patternId: string;
};

// Context Types

type ProjectContextType = {
  project: Resource<ProjectWithPayload | null>;
  tracks: Track[];
  setTracks: SetStoreFunction<Track[]>;
};

type PlayerContextType = {
  time: Accessor<string>;
  setTime: (time: string) => void;
  bpm: Accessor<number>;
  setBpm: (bpm: number) => void;
  playerBeatPos: Accessor<number>;
  setPlayerBeatPos: (beatPos: number) => void;
  isPlaying: Accessor<boolean>;
  setIsPlaying: (isPlaying: boolean) => void;
  totalVolume: Accessor<number>;
  setTotalVolume: (totalVolume: number) => void;
};

type ContextMenuItem = {
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
};

type ContextMenuItems = {
  x: number;
  y: number;
  items: ContextMenuItem[];
};

type ContextMenuProviderType = {
  openMenu: (x: number, y: number, items: any[]) => void;
  closeMenu: () => void;
};

type TimelineContextType = {
  tactElementsNumber: Accessor<number>;
  setTactElementsNumber: (value: number | ((prev: number) => number)) => void;
  tactWidth: Accessor<number>;
  setTactWidth: (value: number | ((prev: number) => number)) => void;
  beatNumber: Accessor<number>;
  setBeatNumber: (value: number | ((prev: number) => number)) => void;
};

type PatternAndTrack = {
  trackId: string;
  patternId: string;
};

type PianoRollContextType = {
  isPianoRollOpen: Accessor<boolean>;
  setIsPianoRollOpen: Setter<boolean>;
  setCurrentPatternAndTrackId: SetStoreFunction<PatternAndTrack>;
  setCurrentPatternWidthInTacts: Setter<number>;
  currentPatternWidthInTacts: Accessor<number>;
  currentPatternAndTrackId: PatternAndTrack;
  openPianoRoll: () => boolean;
  closePianoRoll: () => boolean;
  pianoRollHeight: Accessor<number>;
  setPianoRollHeight: Setter<number>;
};

export type {
  ProjectWithPayload,
  ProjectPayload,
  PayloadMetadata,
  Track,
  BasePattern,
  PatternVST,
  PatternAudio,
  PatternType,
  PatternAudioLoaded,
  Note,
  AudioClipMetadata,
  ProjectContextType,
  PlayerContextType,
  ContextMenuItems,
  ContextMenuProviderType,
  TimelineContextType,
  ContextMenuItem,
  PianoRollContextType,
  PatternAndTrack,
};
