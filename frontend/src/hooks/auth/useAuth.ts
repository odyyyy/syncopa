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
      });

    let response = await makeRequest();
    if (!response.ok) {
      try {
        await refresh();
      } catch {
        logout();
        throw new Error("Unauthorized");
      }

      response = await makeRequest();

      if (!response.ok) {
        logout();
        throw new Error("Unauthorized");
      }
    }

    return response;
  };
}
