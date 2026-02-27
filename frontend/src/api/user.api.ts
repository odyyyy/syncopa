import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuth";
import { apiRequest } from "./base.api";

export function fetchSearchUsersByUsername(username: string): Promise<{ type: "success"; data: User[] } | { type: "error" }>  {
  const protectedRequest = useAuthFetch();
  return apiRequest(
    `${BACKEND_URL}/users/?` +
      new URLSearchParams({
        username: username,
      }).toString(),
    { method: "GET" },
    protectedRequest,
  );
}
