import toast from "solid-toast";
import { BACKEND_URL } from "../config/config";
import { accessToken, setAccessToken } from "../store/auth";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../hooks/auth/useAuth";

export async function register(data: RegisterFormData) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        type: "error",
        detail: responseData?.detail,
      };
    }

    return {
      type: "success",
      data: responseData,
    };
  } catch (error) {
    return {
      type: "error",
      detail: "Ошибка соединения с сервером. Повторите попытку позже",
    };
  }
}

export async function login(data: LoginFormData) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
      credentials: "include"
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        type: "error",
        detail: responseData?.detail,
      };
    }

    return {
      type: "success",
      data: responseData,
    };
  } catch (error) {
    return {
      type: "error",
      detail: "Ошибка соединения с сервером. Повторите попытку позже",
    };
  }
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
