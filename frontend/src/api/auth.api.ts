import { BACKEND_URL } from "../config/config";
import { getCsrfToken } from "../context/auth.context";
import { apiRequest } from "./base.api";



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

export function refreshToken() {
  return apiRequest<RefreshResponse>(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: { "X-CSRF-TOKEN": getCsrfToken() },
    credentials: "include",
  });
}