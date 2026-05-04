import { useAuthFetch } from "@/hooks/auth/useAuthFetch";
import { apiRequest } from "./base.api";
import { BACKEND_URL } from "@/config/config";
import { ProjectPayload } from "@/types/daw.types";
import { BranchesWithVersionsMetadata, BranchCreated, VersionPayload, VersionMetadata, VersionCreated } from "@/types/vcs.types";
import { Patch } from "@/types/vcs.types";

export const useVcsApi = () => {
  const protectedRequest = useAuthFetch();

  const getProjectBranchesWithVersionsMetadata = (
    projectId: string,
  ): ApiResponse<BranchesWithVersionsMetadata> =>
    apiRequest(
      `${BACKEND_URL}/vcs/projects/${projectId}/branches`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  const createBranch = async (
    projectId: string,
    branchTitle: string,
    projectSnapshot: ProjectPayload,
  ): ApiResponse<BranchCreated> =>
    apiRequest(
      `${BACKEND_URL}/vcs/projects/${projectId}/branches`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchTitle,
          projectSnapshot,
        }),
      },
      protectedRequest,
    );
  
  const loadSelectedVersion = async (
    projectId: string,
    branchName: string,
    versionId: string,
  ): ApiResponse<VersionPayload> =>
    apiRequest(
      `${BACKEND_URL}/vcs/projects/${projectId}/branches/${branchName}/versions/${versionId}`,
      {
        method: "GET",
      },
      protectedRequest,
    );
  
  const createVersion = async (
    projectId: string,
    branchName: string,
    projectSnapshot: Patch,
    versionMessage: string,
  ): ApiResponse<VersionCreated> =>
    apiRequest(
      `${BACKEND_URL}/vcs/projects/${projectId}/branches/${branchName}/versions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patch: projectSnapshot,
          versionMessage,
        }),
      },
      protectedRequest,
    );

  return {
    getProjectBranchesWithVersionsMetadata,
    createBranch,
    loadSelectedVersion,
    createVersion,
  };
  

};
