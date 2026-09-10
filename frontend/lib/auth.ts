const API_BASE_URL = "http://192.168.1.41:8000";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("refresh_token");
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function getCurrentUser() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Not authenticated.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/accounts/me/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Authentication failed.");
  }

  return response.json();
}