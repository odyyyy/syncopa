import { BACKEND_URL } from "../config/config";


export async function register(data: RegisterFormData) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {'content-type': 'application/json'}
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

