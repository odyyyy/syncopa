import { useAuthContext } from "./useAuthContext";

export function useAuthFetch() {
  const { accessToken, refresh, logout } = useAuthContext();

  return async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    const makeRequest = () =>
      fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          ...(accessToken() && { Authorization: `Bearer ${accessToken()}` }),
        },
      });

    let response = await makeRequest();
    if (response.status === 401) {
      try {
        await refresh();
      } catch {
        logout();
        throw new Error("Unauthorized");
      }

      response = await makeRequest();

      if (response.status === 401) {
        logout();
        throw new Error("Unauthorized");
      }
    }

    return response;
  };
}
