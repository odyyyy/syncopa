type CoopSession = {
  project_id: string;
  members: string[];
  changes: ProjectChanges[];
};

type ProjectChanges = {
  id: number;
  operation: SyncOperation;
  subject: Subject;
  payload: Record<string, any>;
};

enum SyncOperation {
  MOVE = "move",
  CREATE = "create",
  DELETE = "delete",
  UPDATE = "update",
}

enum Subject {
  TRACK = "track",
  NOTE = "note",
  PRESET = "preset",
}

enum ConnectionState {
  INIT = "init",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

type MemberConnectionInfo = {
  event: ConnectionState;
  member: ProjectMember;
};

type ProjectMember = {
  id: string;
  username: string;
  avatar?: string | null;
};

type CoopSessionContextType = {
  coopSessionMembers: ProjectMember[];
  setCoopSessionMembers: (members: ProjectMember[]) => void;
};


export type {
  CoopSession,
  ProjectChanges,
  MemberConnectionInfo,
  ProjectMember,
  CoopSessionContextType,
};

export {
  SyncOperation,
  Subject,
  ConnectionState,
};