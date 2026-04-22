import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuthFetch";
import { apiRequest } from "./base.api";

export function useProjectsApi() {
  const protectedRequest = useAuthFetch();

  const createProject = (data: ProjectCreate):ApiResponse<ProjectItemProps> =>
    apiRequest(
      `${BACKEND_URL}/projects`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      },
      protectedRequest,
    );

  const getProjectsList = ():ApiResponse<ProjectItemProps[]> =>
    apiRequest(
      `${BACKEND_URL}/projects`,
      {
        method: "GET",
      },
      protectedRequest,
    );
  
  const removeProject = (project_id: string):ApiResponse<ProjectItemProps> =>
    apiRequest(
      `${BACKEND_URL}/projects/${project_id}`,
      {
        method: "DELETE",
      },
      protectedRequest,
    );

  return { createProject, getProjectsList, removeProject };
}
