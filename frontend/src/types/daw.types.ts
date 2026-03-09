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
  totalVolume: number;
};

type Track = {
  trackId: number;
  title: string;
  volume: number;
  patterns: Pattern[] | null;
};

type BasePattern = {
  patternId: number;
  pos: number;
  type: "audio" | "vst";
  ref: string | null;
};

type PatternVST = BasePattern & {
  type: "vst";
  instrumentId: string;
  notes: Note[] | null;
};

type PatternAudio = BasePattern & {
  type: "audio";
  source: string;
  audioMetadata: AudioClipMetadata;
};

type Pattern = PatternVST | PatternAudio;

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

export type {
  ProjectWithPayload,
  ProjectPayload,
  PayloadMetadata,
  Track,
  BasePattern,
  PatternVST,
  PatternAudio,
  Pattern,
  Note,
  AudioClipMetadata,
  ProjectContextType,
  PlayerContextType,
  ContextMenuItems,
  ContextMenuProviderType,
};
