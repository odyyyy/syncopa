export async function apiRequest<T>(input: RequestInfo, init?: RequestInit, fetchFunc: Function = fetch) {
  try {
    const response = await fetchFunc(input, init);
    
    // Test with Tuna
    // const response = await fetchFunc(input, {
    //   ...init,
    //   headers: {
    //     ...(init?.headers || {}),
    //     "tuna-skip-browser-warning": "true",
    //   },
    // });
    
    const data = await response.json();

    if (!response.ok) {
      return {
        type: "error" as const,
        detail: data?.detail,
        status: response.status
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
