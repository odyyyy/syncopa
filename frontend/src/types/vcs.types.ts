import { Accessor, Resource } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { ProjectPayload } from "./daw.types";
import { ProjectChanges } from "./coop.types";

type VersionControlStore = {
  branches: string[];
  versions: Record<string, VersionMetadata[]>;
};

type BranchesWithVersionsMetadata = VersionControlStore;

type VersionMetadata = {
  id: string;
  message: string;
  creatorUsername: string;
  createdAt: string;
  isHead: boolean;
  parentsIds?: string[];
};

type BranchCreated = {
  branchTitle: string;
  initialVersion: VersionMetadata;
};

type VersionCreated = {
  branchTitle: string;
  versionMetadata: VersionMetadata;
};

type VCSStateType = {
  isVCSModeActive: boolean;
  currentVersion: null | (VersionMetadata & { branch: string });
  patches: ProjectChanges[];
};

type Snapshot = {
  type: "snapshot";
  snapshot: ProjectPayload;
};

type Patch = {
  type: "patch";
  changes: ProjectChanges[];
};

type VersionWithPatch = {
  type: "patch";
  initialVersion: ProjectPayload;
  patch: ProjectChanges[];
};

type VersionPayload = Snapshot | VersionWithPatch;

type VCSContextType = {
  versionControlStore: VersionControlStore;
  setVersionControlStore: SetStoreFunction<VersionControlStore>;
  VCSState: VCSStateType;
  setVCSState: SetStoreFunction<VCSStateType>;
  isCreatingNewBranch: Accessor<boolean>;
  setIsCreatingNewBranch: (isCreating: boolean) => void;
  newBranchName: Accessor<string>;
  setNewBranchName: (name: string) => void;
  selectedBranchInModal: Accessor<string>;
  setSelectedBranchInModal: (branch: string) => void;
  viewMode: Accessor<"all" | "branch">;
  setViewMode: (mode: "all" | "branch") => void;
  activeTab: Accessor<"history" | "conflicts">;
  setActiveTab: (tab: "history" | "conflicts") => void;
  selectedVersion: Accessor<VersionMetadata | null>;
  setSelectedVersion: (version: VersionMetadata | null) => void;
  branchesWithVersionsMetadata: Resource<void>;
};

interface ConflictDetail {
  type: string;
  entity_id: string;
  source_value: unknown | null;
  target_value: unknown | null;
}

interface MergeResult {
  operations: ProjectChanges[];
  conflicts: ConflictDetail[];
  mergedVersionId: string | null;
}

export const ORPHAN_CONFLICT_PREFIX = "no_common_ancestor";

export const CONFLICT_TYPE_LABELS: Record<string, string> = {
  track_conflict: "трек изменён в обеих ветках",
  pattern_conflict: "паттерн изменён в обеих ветках",
  pattern_existence_conflict: "паттерн создан/удалён в обеих ветках",
  pattern_transform_conflict: "позиция паттерна изменена в обеих ветках",
  note_conflict: "нота изменена в обеих ветках",
  preset_conflict: "пресет изменён в обеих ветках",
  volume_conflict: "громкость изменена в обеих ветках",
  effect_conflict: "эффект изменён в обеих ветках",
  both_deleted: "удалено в обеих ветках",
  delete_modify: "удалено в одной, изменено в другой",
  both_modified: "изменено в обеих ветках",
};

export type {
  VCSContextType,
  VCSStateType,
  VersionControlStore,
  BranchesWithVersionsMetadata,
  VersionMetadata,
  Patch,
  BranchCreated,
  VersionPayload,
  VersionWithPatch,
  VersionCreated,
  ConflictDetail,
  MergeResult,
};
