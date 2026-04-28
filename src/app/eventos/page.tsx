"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { arenaTheme } from "@/lib/arena-theme";
import { listEventos, type EventoDTO } from "@/lib/api";

const CATEGORIES = ["Todos", "Esporte", "Cultural", "Show", "Corporativo"];
const ORDER_OPTIONS = ["Data", "Lotação", "Participantes"];

function calcOccupancy(event: EventoDTO): number {
  if (!event.capacity) return 0;
  return Math.round((event.expectedAttendance / event.capacity) * 100);
}

function formatCategory(category: EventoDTO["category"]): string {
  if (category === "ESPORTE") return "Esporte";
  if (category === "CULTURAL") return "Cultural";
  if (category === "SHOW") return "Show";
  return "Corporativo";
}

export default function EventosPage() {
  const [events, setEvents] = useState<EventoDTO[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [order, setOrder] = useState("Data");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listEventos()
      .then((data) => setEvents(data))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erro ao carregar eventos";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return [...events]
      .filter((event) => {
        const matchCategory = category === "Todos" || formatCategory(event.category) === category;
        const matchSearch = event.eventName.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (order === "Data") return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        if (order === "Lotação") return calcOccupancy(b) - calcOccupancy(a);
        return b.expectedAttendance - a.expectedAttendance;
      });
  }, [category, events, order, search]);

  return (
    <ArenaPageLayout active="eventos">
      <div className="mb-10">
        <h1 className="mb-2 text-5xl font-black tracking-tight">
          Todos os <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Eventos</span>
        </h1>
        <p className="text-white/40">Encontre o evento perfeito para você</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:min-w-0 lg:flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar evento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={"pl-10 " + arenaTheme.input}
          />
        </div>

        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/8 bg-white/3 p-1 sm:overflow-visible lg:flex-[1.4]">
          <SlidersHorizontal size={13} className="ml-2 shrink-0 text-white/30" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                category === cat ? "bg-violet-600 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className={arenaTheme.input + " w-full cursor-pointer appearance-none lg:w-52"}
        >
          {ORDER_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0a0a0f]">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-white/30">
        Exibindo <span className="font-semibold text-white/60">{filtered.length}</span> evento
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {error && !loading && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={arenaTheme.glassCard + " overflow-hidden"}>
              <Skeleton className="h-52 w-full rounded-none rounded-t-2xl" />
              <div className="p-5">
                <Skeleton className="mb-3 h-5 w-44" />
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))
        ) : (
          filtered.map((event) => (
            <EventCard
              key={event.idEvento ?? event.eventName}
              evento={event}
              href={event.idEvento ? `/eventos/${event.idEvento}` : "/eventos"}
            />
          ))
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="py-24 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <p className="text-sm text-white/30">Nenhum evento encontrado para os filtros selecionados.</p>
        </div>
      )}
    </ArenaPageLayout>
  );
}