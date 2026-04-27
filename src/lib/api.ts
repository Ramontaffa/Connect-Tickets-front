import { getToken } from "@/lib/auth-session";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `Erro ${res.status}`);
  }

  return res.json();
}

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  type?: string;
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  roles?: string[];
};

export type RegisterResponse = {
  message?: string;
  id?: number;
  username?: string;
  email?: string;
};

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(data: {
  name: string;
  email: string;
  password: string;
  username: string;
}) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
