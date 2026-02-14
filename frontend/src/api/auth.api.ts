async function register(data: RegisterFormData) {
  try {
    const response = await fetch("http://localhost:8000/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        type: "error",
        message: responseData?.message,
      };
    }

    return {
      type: "success",
      data: responseData,
    };
  } catch (error) {
    return {
      type: "error",
      message: "Ошибка соединения с сервером. Повторите попытку позже",
    };
  }
}

async function login(data: LoginFormData) {
  try {
    const response = await fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        type: "error",
        message: responseData?.message,
      };
    }

    return {
      type: "success",
      data: responseData,
    };
  } catch (error) {
    return {
      type: "error",
      message: "Ошибка соединения с сервером. Повторите попытку позже",
    };
  }
}
