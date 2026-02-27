import toast from "solid-toast";
import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
} from "solid-js";
import { BACKEND_URL } from "../config/config";
import { accessToken, setAccessToken } from "../store/auth";
import { logoutFetch } from "../api/auth.api";
import { setUserData } from "../store/user";

export const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
  let refreshPromise: Promise<void> | null = null;

  const refresh = async () => {
    if (!refreshPromise) {
      refreshPromise = fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-TOKEN": getCsrfToken() },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Ошибка при обновлении токена");
          const data = await res.json();
          setAccessToken(data.access_token);
          await setupUserData();
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  const logout = async () => {
    const response = await logoutFetch();
    if (response.type === "success") {
      toast.success(response.detail);
      setAccessToken(null);
      window.location.href = "/login";
    } else if (response.type === "error") {
      toast.error(response.detail);
    }
  };

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      await refresh();
    } catch {
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, logout, refresh, loading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function getCsrfToken() {
  return String(document.cookie.match(/csrf_refresh_token=([^;]+)/)?.[1]);
}

export const setupUserData = async () => {
  const response = await fetch(`${BACKEND_URL}/users/me`, {
    method: "GET",
    headers: {
      ...(accessToken() && {
        Authorization: `Bearer ${accessToken()}`,
        "X-CSRF-TOKEN": getCsrfToken(),
      }),
    },
  });
  setUserData(await response.json());
};
