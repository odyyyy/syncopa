import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuth";
import { ProjectWithPayload, ProjectPayload } from "../types/daw.types";
import { apiRequest } from "./base.api";

const useDawApi = () => {
  const protectedRequest = useAuthFetch();

  const getProjectWithPayload = (
    project_id: string,
  ): ApiResponse<ProjectWithPayload> =>
    apiRequest(
      `${BACKEND_URL}/daw/payload/${project_id}`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  const updateProjectPayload = (
    project_id: string,
    payload: ProjectPayload,
  ): ApiResponse<ProjectWithPayload> =>
    apiRequest(
      `${BACKEND_URL}/daw/payload/${project_id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      },
      protectedRequest,
    );
  

  return {
    getProjectWithPayload,
    updateProjectPayload,
  };
};

export default useDawApi;
