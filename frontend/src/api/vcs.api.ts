import { useAuthFetch } from "@/hooks/auth/useAuthFetch";
import { apiRequest } from "./base.api";
import { BACKEND_URL } from "@/config/config";
import { ProjectPayload } from "@/types/daw.types";

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

  return {
    getProjectBranchesWithVersionsMetadata,
    createBranch,
  };
};
