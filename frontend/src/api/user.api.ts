import { BACKEND_URL } from "../config/config";
import { useAuthFetch } from "../hooks/auth/useAuthFetch";
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

  const updateInvitationStatus = (
    invitationId: string,
    status: "accepted" | "rejected",
  ): ApiResponse<Invitation> =>
    apiRequest(
      `${BACKEND_URL}/users/me/invitations/${invitationId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "content-type": "application/json" },
      },
      protectedRequest,
    );

  return {
    getInvitationsList,
    updateInvitationStatus,
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
