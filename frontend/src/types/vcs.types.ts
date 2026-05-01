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
};

type BranchCreated = {
  branchTitle: string;
  initialVersion: VersionMetadata;
};
