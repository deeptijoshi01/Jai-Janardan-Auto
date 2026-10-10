export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  profileImage: string;
}

interface AuthResponse {
  success?: boolean;
  message?: string;
  user?: AdminUser;
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminRemember");
  } catch {
    // Legacy browser-stored sessions are removed when storage is available.
  }
}

export async function verifyAdminSession(): Promise<AdminUser | null> {
  clearAdminSession();
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (response.status === 401) return null;
  const data = (await response.json().catch(() => null)) as AuthResponse | null;
  if (!response.ok) {
    throw new Error(data?.message || "Unable to verify the admin session.");
  }
  return data?.success && data.user ? data.user : null;
}

export async function logoutAdmin(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok && response.status !== 401) {
      const data = (await response.json().catch(() => null)) as AuthResponse | null;
      throw new Error(data?.message || "Unable to end the admin session.");
    }
  } finally {
    clearAdminSession();
  }
}

export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });
  if (response.status === 401) {
    clearAdminSession();
    window.location.assign("/admin/login");
  }
  return response;
}
