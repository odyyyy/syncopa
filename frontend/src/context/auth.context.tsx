import toast from "solid-toast";
import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
} from "solid-js";
import { BACKEND_URL } from "../config/config";
import { accessToken, setAccessToken } from "../store/auth";
import { logoutFetch, refreshToken } from "../api/auth.api";
import { setUserData } from "../store/user";
import { apiRequest } from "../api/base.api";

export const AuthContext = createContext<AuthContextType>();

export const AuthProvider: ParentComponent = (props) => {
  const refresh = async () => {
    const response = await refreshToken();
    if (response.type === "error")
      throw new Error("Ошибка при обновлении токена");
    const data = response.data;
    setAccessToken(data.access_token);
    await setupUserData();
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
  const response = await apiRequest<User>(`${BACKEND_URL}/users/me`, {
    method: "GET",
    headers: {
      ...(accessToken() && {
        Authorization: `Bearer ${accessToken()}`,
      }),
    },
    credentials: "omit",
  });

  if (response.type === "error") {
    toast.error("Ошибка при получении данных пользователя");
    throw new Error("Ошибка при получении данных пользователя");
  }

  setUserData(response.data);
};
