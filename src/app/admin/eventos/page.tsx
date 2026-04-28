"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, PlusCircle, Pencil, Trash2 } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { Button } from "@/components/ui/button";
import { listEventos, deleteEvento, type EventoDTO } from "@/lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  ESPORTE: "Esporte",
  SHOW: "Show",
  CULTURAL: "Cultural",
  CORPORATIVO: "Corporativo",
};

function formatDate(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleDateString("pt-BR");
}

function formatTime(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(evento: EventoDTO): string {
  if (evento.isFree) return "Gratuito";
  if (evento.price != null) {
    return evento.price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  return "—";
}

export default function AdminEventosPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    setError(null);
    listEventos()
      .then((data) => setEvents(data))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erro ao carregar eventos";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function handleDelete(evento: EventoDTO) {
    if (!evento.idEvento) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o evento "${evento.eventName}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    const token = session?.accessToken;
    if (!token) {
      setError("Você precisa estar autenticado para excluir eventos.");
      return;
    }

    setDeletingId(evento.idEvento);
    try {
      await deleteEvento(evento.idEvento, token);
      setEvents((prev) => prev.filter((e) => e.idEvento !== evento.idEvento));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir evento.";
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
      containerClassName="mx-auto w-full max-w-6xl"
    >
      {/* BACK LINK */}
      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar ao Dashboard
      </Link>

      {/* PAGE HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Gerenciar Eventos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize, edite e exclua os eventos cadastrados
          </p>
        </div>
        <Link
          href="/admin/eventos/cadastrar"
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <PlusCircle size={16} />
          Cadastrar Novo Evento
        </Link>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">Nenhum evento cadastrado.</p>
          <Link
            href="/admin/eventos/cadastrar"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline"
          >
            <PlusCircle size={14} />
            Cadastrar o primeiro evento
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nome
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Categoria
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Data
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Capacidade
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Público Esperado
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Preço
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((evento, idx) => (
                <tr
                  key={evento.idEvento ?? idx}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 truncate max-w-[220px]">
                      {evento.eventName}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {CATEGORY_LABELS[evento.category] ?? evento.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    <span>{formatDate(evento.scheduledAt)}</span>
                    <span className="ml-1 text-gray-400">{formatTime(evento.scheduledAt)}</span>
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums text-gray-600">
                    {evento.capacity.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums text-gray-600">
                    {evento.expectedAttendance.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatPrice(evento)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/eventos/${evento.idEvento}/editar`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 rounded-lg border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          <Pencil size={12} />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === evento.idEvento}
                        onClick={() => handleDelete(evento)}
                        className="h-8 gap-1.5 rounded-lg border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                      >
                        <Trash2 size={12} />
                        {deletingId === evento.idEvento ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ArenaPageLayout>
  );
}
