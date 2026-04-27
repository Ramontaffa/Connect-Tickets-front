export type AuthUser = {
  id?: number;
  name?: string;
  email: string;
  username?: string;
  roles?: string[];
};

const TOKEN_KEY = "arena:auth-token:v1";
const USER_KEY = "arena:auth-user:v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(token: string, user: AuthUser) {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
