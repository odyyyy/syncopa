import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuth";
import { apiRequest } from "./base.api";

export function fetchSearchUsersByUsername(
  username: string,
): ApiResponse<User[]> {
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

export function useInvitationsApi() {
  const protectedRequest = useAuthFetch();

  const getInvitationsList = (): ApiResponse<Invitation[]> =>
    apiRequest(
      `${BACKEND_URL}/users/me/invitations`,
      {
        method: "GET",
      },
      protectedRequest,
    );
  return {
    getInvitationsList,
  };
}

export function useUserDataManagementApi() {
  const protectedRequest = useAuthFetch();

  const updateUserData = (data: FormData): ApiResponse<UserDataUpdate> =>
    apiRequest(
      `${BACKEND_URL}/users/`,
      {
        method: "PATCH",
        body: data,
      },
      protectedRequest,
    );
  return {
    updateUserData,
  };
}
