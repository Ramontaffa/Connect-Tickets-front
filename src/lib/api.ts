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

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  idUsuario?: number;
  username?: string;
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN" | string;
};

export function register(data: {
  name: string;
  email: string;
  password: string;
  username: string;
}) {
  return apiFetch<RegisterResponse>("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginAPI(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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

export async function listEventos(category?: string): Promise<EventoDTO[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const result = await apiFetch<unknown>(`/eventos${query}`);
  if (Array.isArray(result)) return result as EventoDTO[];
  if (result && typeof result === "object") {
    for (const key of ["content", "data", "items", "eventos"]) {
      const val = (result as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as EventoDTO[];
    }
  }
  return [];
}

export function getEvento(id: number): Promise<EventoDTO> {
  return apiFetch<EventoDTO>(`/eventos/${id}`);
}

export function createEvento(data: EventoDTO, token: string): Promise<EventoDTO> {
  return apiFetch<EventoDTO>("/eventos", {
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
  return apiFetch<EventoDTO>(`/eventos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    accessToken: token,
  });
}

export async function deleteEvento(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/eventos/${id}`, {
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

// ─── Sugestões ──────────────────────────────────────────────────────────────

export interface SugestaoDTO {
  eventName: string;
  description: string;
  category: EventoCategory;
}

export interface SugestaoResponseDTO {
  idSugestao: number;
  eventName: string;
  description: string;
  category: EventoCategory;
  status: "PENDENTE" | "EM_ANALISE" | "APROVADA" | "REJEITADA";
  creatorName: string;
}

export function createSugestao(
  data: SugestaoDTO,
  token?: string
): Promise<SugestaoResponseDTO> {
  return apiFetch<SugestaoResponseDTO>("/api/sugestoes", {
    method: "POST",
    body: JSON.stringify(data),
    accessToken: token,
  });
}

// ─── Visitas ────────────────────────────────────────────────────────────────

export interface VisitaDTO {
  scheduledAt: string; // ISO 8601 format: "2026-12-01T10:00:00"
  requesterId: number;
  authorizerId?: number | null;
  visitorCount: number;
}

export interface VisitaResponseDTO {
  idVisita: number;
  scheduledAt: string;
  isAuthorized: boolean;
  requesterName: string;
  authorizerName: string | null;
  visitorCount: number;
}

export function createVisita(
  data: VisitaDTO,
  token: string
): Promise<VisitaResponseDTO> {
  return apiFetch<VisitaResponseDTO>("/visitas", {
    method: "POST",
    body: JSON.stringify(data),
    accessToken: token,
  });
}
