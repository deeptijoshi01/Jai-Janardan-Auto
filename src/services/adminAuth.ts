const API_BASE_URL = "http://localhost:5000/api";

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  expiresIn?: number;
}

export function getAdminToken(): string {
  try {
    return (
      sessionStorage.getItem("adminToken") ||
      localStorage.getItem("adminToken") ||
      ""
    );
  } catch {
    return "";
  }
}

export function storeAdminSession(token: string, remember: boolean): void {
  clearAdminSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("adminToken", token);
  storage.setItem("adminLoggedIn", "true");
  if (remember) localStorage.setItem("adminRemember", "true");
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminRemember");
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  const response = await fetch(`${API_BASE_URL}/admin-auth/session`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok;
}

export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    clearAdminSession();
    window.location.assign("/admin/login");
  }
  return response;
}
