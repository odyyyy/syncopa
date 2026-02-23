import { useContext } from "solid-js";
import { AuthContext } from "../../context/auth";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext не найден");
  return ctx;
};

export function useAuthFetch() {
  const { accessToken, refresh, logout } = useAuth();

  return async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    const makeRequest = () =>
      fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          ...(accessToken() && { Authorization: `Bearer ${accessToken()}` }),
        },
        credentials: "include",
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
