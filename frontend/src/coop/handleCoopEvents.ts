import { SetStoreFunction } from "solid-js/store";
import {
  ProjectChanges,
  ConnectionState,
  ConnectionData,
  SyncOperation,
  Target,
  CoopOperationsHandlers,
} from "../types/coop.types";
import { useCoopContext } from "../context/coop/coopsession.context";
import { useVCSContext } from "@/context/vcs/vcs.context";

export const handleCoopEvents = (
  data: ConnectionData | ProjectChanges,
  setCoopSessionMembers: SetStoreFunction<ProjectMember[]>,
  handlers: CoopOperationsHandlers,
) => {
  if ("event" in data && "member" in data) {
    handleConnectionEvents(data as ConnectionData, setCoopSessionMembers);
  } else if ("operation" in data && "target" in data && "payload" in data) {
    applyIncomeOperation(data as ProjectChanges, handlers);
  }
};

const handleConnectionEvents = (
  data: ConnectionData,
  setCoopSessionMembers: SetStoreFunction<ProjectMember[]>,
) => {
  switch (data.event) {
    case ConnectionState.INIT:
      setCoopSessionMembers(data.member);
      break;
    case ConnectionState.CONNECTED:
      setCoopSessionMembers((prev: ProjectMember[]) => [...prev, data.member]);
      break;
    case ConnectionState.DISCONNECTED:
      setCoopSessionMembers((prev: ProjectMember[]) =>
        prev.filter((member) => member.id !== data.member.id),
      );
      break;
  }
};
export const useSendChangeEvent = () => {
  const { VCSState, setVCSState } = useVCSContext();
  const { websocketConnection } = useCoopContext();

  const sendChangeEvent = (
    operation: SyncOperation,
    target: Target,
    payload: any,
  ) => {
    const op = { operation, target, payload, timestamp: Date.now() };
    if (!VCSState.isVCSModeActive) {
      websocketConnection?.send(JSON.stringify(op));
    } else {
      setVCSState("patches", VCSState.patches.length, op);
    }
  };

  return { sendChangeEvent };
};

export const applyIncomeOperation = (
  data: ProjectChanges,
  handlers: CoopOperationsHandlers,
) => {
  switch (data.target) {
    case Target.TRACK:
      switch (data.operation) {
        case SyncOperation.CREATE:
          handlers.addTrack(data.payload.track);
          break;
        case SyncOperation.REMOVE:
          handlers.removeTrack(data.payload.trackId);
          break;
      }
      break;
    case Target.PATTERN:
      switch (data.operation) {
        case SyncOperation.CREATE:
          if (data.payload.type === "vst") {
            handlers.addPattern(data.payload.trackId, data.payload.patternId);
          } else if (data.payload.type === "audio") {
            handlers.addAudioPattern(
              data.payload.audioPattern,
              data.payload.trackId,
            );
          }
          break;

        case SyncOperation.REMOVE:
          handlers.removePattern(data.payload.patternId, data.payload.trackId);
          break;

        case SyncOperation.TRANSFORM:
          handlers.transformPattern(
            data.payload.patternId,
            data.payload.trackId,
            data.payload.pos,
            data.payload.width,
            data.payload.notes,
          );
          break;
      }
      break;
    case Target.NOTE:
      switch (data.operation) {
        case SyncOperation.CREATE:
          handlers.addNote(
            data.payload.note,
            data.payload.trackId,
            data.payload.patternId,
          );
          break;
        case SyncOperation.REMOVE:
          handlers.removeNote(
            data.payload.trackId,
            data.payload.patternId,
            data.payload.noteId,
          );
          break;

        case SyncOperation.TRANSFORM:
          handlers.transformNote(
            data.payload.note.pos,
            data.payload.note.duration,
            data.payload.note.note,
            data.payload.trackId,
            data.payload.patternId,
            data.payload.noteId,
          );
          break;
      }
      break;
    case Target.PRESET:
      switch (data.operation) {
        case SyncOperation.UPDATE:
          handlers.updatePreset(data.payload.presetId, data.payload.trackId);
          break;
      }
      break;
    case Target.TRACK_VOLUME:
      switch (data.operation) {
        case SyncOperation.UPDATE:
          handlers.updateTrackVolume(data.payload.volume, data.payload.trackId);
          break;
      }
      break;
    case Target.EFFECT:
      switch (data.operation) {
        case SyncOperation.CREATE:
          handlers.applyEffectToPattern(
            data.payload.patternId,
            data.payload.effectParams,
          );
          break;
        case SyncOperation.REMOVE:
          handlers.removeEffectFromPattern(
            data.payload.patternId,
            data.payload.effectType,
          );
          break;
      }
      break;
  }
};
