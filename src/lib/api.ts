const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { accessToken?: string }
): Promise<T> {
  const { accessToken, ...fetchOptions } = options ?? {};

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...fetchOptions?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `Erro ${res.status}`);
  }

  return res.json();
}

export type RegisterResponse = {
  message?: string;
  id?: number;
  username?: string;
  email?: string;
};

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
