import { BACKEND_URL } from "../config/config";
import { getCsrfToken } from "../context/auth";

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
