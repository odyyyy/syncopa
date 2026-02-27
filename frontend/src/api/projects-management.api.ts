import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuth";
import { apiRequest } from "./base.api";

export function useProjectsApi() {
  const protectedRequest = useAuthFetch();

  const createProject = (data: ProjectCreate) =>
    apiRequest(
      `${BACKEND_URL}/projects`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      },
      protectedRequest,
    );

  const fetchProjectsList = () =>
    apiRequest(
      `${BACKEND_URL}/projects`,
      {
        method: "GET",
      },
      protectedRequest,
    );

  return { createProject };
}
