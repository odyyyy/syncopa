import { BACKEND_URL } from "../config/config";
import { getCsrfToken } from "../context/auth";
import { useAuth } from "../hooks/auth/useAuth";
import { accessToken } from "../store/auth";

export async function apiRequest<T>(input: RequestInfo, init?: RequestInit) {
  try {
    const response = await fetch(input, init);
    const data = await response.json();

    if (!response.ok) {
      return {
        type: "error" as const,
        detail: data?.detail,
      };
    }

    return {
      type: "success" as const,
      data: data as T,
    };
  } catch {
    return {
      type: "error" as const,
      detail: "Ошибка соединения с сервером. Повторите попытку позже",
    };
  }
}

export function register(data: RegisterFormData) {
  return apiRequest(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function login(data: LoginFormData) {
  return apiRequest<LoginResponse>(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export function logoutFetch() {
  return apiRequest(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    headers: { "X-CSRF-TOKEN": getCsrfToken() },
    credentials: "include",
  });
}

export function authFetch() {
  const { accessToken, refresh, logout } = useAuth();

  return async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    const makeRequest = () =>
      fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          ...(accessToken() && {
            Authorization: `Bearer ${accessToken()}`,
          }),
        },
        credentials: "include",
      });

    let response = await makeRequest();

    if (response.status !== 401) {
      return response;
    }

    try {
      await refresh();
    } catch {
      logout();
    }

    response = await makeRequest();

    if (response.status === 401) {
      logout();
    }

    return response;
  };
}
