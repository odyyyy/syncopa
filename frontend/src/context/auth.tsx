import toast from "solid-toast";
import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
} from "solid-js";
import { BACKEND_URL } from "../config/config";
import { accessToken, setAccessToken } from "../store/auth";

export const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {

  let refreshPromise: Promise<void> | null = null;

  function getCsrfToken() {
    return document.cookie.match(/csrf_refresh_token=([^;]+)/)?.[1];
  }

  const refresh = async () => {
    if (!refreshPromise) {
      refreshPromise = fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-TOKEN": String(getCsrfToken()) },
      }
      )
        .then(async (res) => {
          if (!res.ok) throw new Error("Ошибка при обновлении токена");
          const data = await res.json();
          setAccessToken(data.access_token);
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  const logout = () => {
    setAccessToken(null);
    // TODO: дописать запрос на бек с auth/logout
    toast.error("Срок сессии истек. Войдите в аккаунт снова!");
    window.location.href = "/login";
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
