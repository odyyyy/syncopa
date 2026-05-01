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
  
  const removeProject = (projectId: string):ApiResponse<ProjectItemProps> =>
    apiRequest(
      `${BACKEND_URL}/projects/${projectId}`,
      {
        method: "DELETE",
      },
      protectedRequest,
    );

  const inviteMembers = (projectId: string, members: string[]):ApiResponse<ProjectItemProps> =>
    apiRequest(
      `${BACKEND_URL}/projects/${projectId}/invitations`,
      {
        method: "POST",
        body: JSON.stringify({ members }),
        headers: { "Content-Type": "application/json" },
      },
      protectedRequest,
    );

  return { createProject, getProjectsList, removeProject, inviteMembers };
}
