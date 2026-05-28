import { SetStoreFunction } from "solid-js/store";
import { Note, PatternAudio, PatternVST, Track } from "./daw.types";
import { Effect } from "./presets.types";

type CoopSession = {
  project_id: string;
  members: string[];
  changes: ProjectChanges[];
};

type ProjectChanges = {
  operation: SyncOperation;
  target: Target;
  payload: Record<string, any>;
  timestamp: number;
};

enum SyncOperation {
  TRANSFORM = "transform",
  CREATE = "create",
  REMOVE = "remove",
  UPDATE = "update",
}

enum Target {
  TRACK = "track",
  PATTERN = "pattern",
  NOTE = "note",
  PRESET = "preset",
  TRACK_VOLUME = "track_volume",
  EFFECT = "effect",
  CURSOR = "cursor",
}

enum ConnectionState {
  INIT = "init",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

type ProjectMember = {
  id: string;
  username: string;
  avatar?: string | null;
};

type CoopSessionContextType = {
  coopSessionMembers: ProjectMember[];
  setCoopSessionMembers: SetStoreFunction<ProjectMember[]>;
  websocketConnection: WebSocket | null;
  coopOperationsHandlers: CoopOperationsHandlers;
  remoteCursors: Record<string, CoopCursorType>;
  setRemoteCursors: SetStoreFunction<Record<string, CoopCursorType>>;
};

type ConnectionData =
  | { event: ConnectionState.INIT; member: ProjectMember[] }
  | { event: ConnectionState.CONNECTED; member: ProjectMember }
  | { event: ConnectionState.DISCONNECTED; member: ProjectMember };

type CoopOperationsHandlers = {
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  addPattern: (trackId: string, pattern: PatternVST) => void;
  addAudioPattern: (audioPattern: PatternAudio, trackId: string) => void;
  removePattern: (patternId: string, trackId: string) => void;
  transformPattern: (
    patternId: string,
    trackId: string,
    pos: number,
    width: number,
    notes: Note[],
  ) => void;
  addNote: (note: Note, trackId: string, patternId: string) => void;
  removeNote: (trackId: string, patternId: string, noteId: string) => void;
  transformNote: (
    pos: number,
    duration: number,
    note: string,
    trackId: string,
    patternId: string,
    noteId: string,
  ) => void;
  updatePreset: (presetId: number, trackId: string) => void;
  updateTrackVolume: (volume: number, trackId: string) => void;
  applyEffectToPattern: (patternId: string, effectParams: Effect) => void;
  removeEffectFromPattern: (patternId: string, effectType: string) => void;
};

type CoopCursorType = {
  userId: string;
  username: string;
  x: number;
  y: number;
};

export type {
  CoopSession,
  ProjectChanges,
  ProjectMember,
  CoopSessionContextType,
  ConnectionData,
  CoopOperationsHandlers, CoopCursorType as RemoteCursor
};

export { SyncOperation, Target, ConnectionState };
