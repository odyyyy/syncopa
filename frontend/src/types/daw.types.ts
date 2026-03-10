import { Accessor, Resource } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

type ProjectWithPayload = {
  projectId: string;
  title: string;
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
  patterns: PatternType[] | null;
};

type BasePattern = {
  patternId: string;
  title: string;
  pos: number;
  width: number;
  type: "audio" | "vst";
  ref: string | null;
};

type PatternVST = BasePattern & {
  type: "vst";
  instrumentId: string | null;
  notes: Note[] | null;
};

type PatternAudio = BasePattern & {
  type: "audio";
  source: string;
  audioMetadata: AudioClipMetadata;
};

type PatternType = PatternVST | PatternAudio;

type Note = {
  pos: number;
  duration: number;
  pitch: number;
  velocity: number;
};

type AudioClipMetadata = {
  title: string;
  duration: number;
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
  startOrPausePlaying: () => void;
  tactElementsNumber: Accessor<number>;
  setTactElementsNumber: (tactElementsNumber: number) => void;
  totalVolume: Accessor<number>;
  setTotalVolume: (totalVolume: number) => void;
};

type ContextMenuItems = {
  x: number;
  y: number;
  items: any[];
};

type ContextMenuProviderType = {
  openMenu: (x: number, y: number, items: any[]) => void;
  closeMenu: () => void;
};

type TracksContextType = {
  tactElementsNumber: Accessor<number>;
  setTactElementsNumber: (value: number | ((prev: number) => number)) => void;
  tactWidth: Accessor<number>;
  setTactWidth: (value: number | ((prev: number) => number)) => void;
  beatNumber: Accessor<number>;
  setBeatNumber: (value: number | ((prev: number) => number)) => void;
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
  Note,
  AudioClipMetadata,
  ProjectContextType,
  PlayerContextType,
  ContextMenuItems,
  ContextMenuProviderType,
  TracksContextType,
};
