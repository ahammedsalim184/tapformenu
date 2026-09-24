const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token")
  );
}

export function logout() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/accounts/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();

    if (!data.access) {
      logout();
      return null;
    }

    const isUsingLocalStorage =
      typeof window !== "undefined" &&
      !!localStorage.getItem("refresh_token");

    if (isUsingLocalStorage) {
      localStorage.setItem(
        "access_token",
        data.access
      );

      if (data.refresh) {
        localStorage.setItem(
          "refresh_token",
          data.refresh
        );
      }
    } else {
      sessionStorage.setItem(
        "access_token",
        data.access
      );

      if (data.refresh) {
        sessionStorage.setItem(
          "refresh_token",
          data.refresh
        );
      }
    }

    return data.access;
  } catch {
    return null;
  }
}

export async function getValidAccessToken() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return await refreshAccessToken();
    }

    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const currentTime = Math.floor(
      Date.now() / 1000
    );

    if (
      typeof payload.exp === "number" &&
      payload.exp > currentTime + 30
    ) {
      return token;
    }
  } catch {
    return await refreshAccessToken();
  }

  return refreshAccessToken();
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  let token = await getValidAccessToken();

  if (!token) {
    throw new Error("Not authenticated.");
  }

  const headers = new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${token}`
  );

  const response = await fetch(input, {
    ...init,
    headers,
    cache: init.cache || "no-store",
  });

  if (response.status !== 401) {
    return response;
  }

  token = await refreshAccessToken();

  if (!token) {
    throw new Error("Authentication failed.");
  }

  const retryHeaders = new Headers(init.headers);

  retryHeaders.set(
    "Authorization",
    `Bearer ${token}`
  );

  return fetch(input, {
    ...init,
    headers: retryHeaders,
    cache: init.cache || "no-store",
  });
}

export async function getCurrentUser() {
  const response = await apiFetch(
    `${API_BASE_URL}/accounts/me/`
  );

  if (!response.ok) {
    throw new Error("Authentication failed.");
  }

  return response.json();
}