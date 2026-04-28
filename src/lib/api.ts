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

// ─── Eventos ────────────────────────────────────────────────────────────────

export type EventoCategory = "ESPORTE" | "SHOW" | "CULTURAL" | "CORPORATIVO";

export interface EventoDTO {
  idEvento?: number;
  eventName: string;
  description?: string;
  capacity: number;
  locationDetail?: string;
  creatorId?: number;
  isFree?: boolean;
  scheduledAt: string;
  eventTypeId?: number;
  price?: number;
  expectedAttendance: number;
  isWeekend?: boolean;
  category: EventoCategory;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export function listEventos(category?: string): Promise<EventoDTO[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<EventoDTO[]>(`/api/eventos${query}`);
}

export function getEvento(id: number): Promise<EventoDTO> {
  return apiFetch<EventoDTO>(`/api/eventos/${id}`);
}

export function createEvento(data: EventoDTO, token: string): Promise<EventoDTO> {
  return apiFetch<EventoDTO>("/api/eventos", {
    method: "POST",
    body: JSON.stringify(data),
    accessToken: token,
  });
}

export function updateEvento(
  id: number,
  data: EventoDTO,
  token: string
): Promise<EventoDTO> {
  return apiFetch<EventoDTO>(`/api/eventos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    accessToken: token,
  });
}

export async function deleteEvento(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/eventos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? `Erro ${res.status}`);
  }
}
