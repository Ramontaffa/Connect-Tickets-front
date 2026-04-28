"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Users, TrendingUp, MapPin, ArrowRight, Clock } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { listEventos, type EventoDTO } from "@/lib/api";
import { arenaTheme } from "@/lib/arena-theme";

function buildStats(events: EventoDTO[]) {
  const totalEvents = events.length;
  const totalParticipants = events.reduce((sum, event) => sum + event.expectedAttendance, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const avgOccupancy =
    totalEvents === 0
      ? 0
      : Math.round(
          events.reduce((sum, event) => {
            if (!event.capacity) return sum;
            return sum + (event.expectedAttendance / event.capacity) * 100;
          }, 0) / totalEvents
        );

  return {
    totalEvents,
    totalParticipants,
    totalCapacity,
    avgOccupancy,
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<EventoDTO[]>([]);
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

  const featuredEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 3),
    [events]
  );

  const { totalEvents, totalParticipants, totalCapacity, avgOccupancy } = buildStats(events);

  const stats = [
    { icon: CalendarDays, value: totalEvents.toLocaleString("pt-BR"), label: "Eventos Disponíveis" },
    { icon: Users, value: totalParticipants.toLocaleString("pt-BR"), label: "Participantes Totais" },
    { icon: TrendingUp, value: totalCapacity.toLocaleString("pt-BR"), label: "Capacidade Máxima" },
    { icon: MapPin, value: `${avgOccupancy}%`, label: "Lotação Média" },
  ];

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="px-0 pt-0 pb-0"
      containerClassName="max-w-none p-0"
    >

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 h-100 w-150 rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 h-75 w-100 rounded-full bg-fuchsia-600/15 blur-[100px] pointer-events-none" />

        <div className={"relative " + arenaTheme.heroContainer}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Plataforma oficial da Arena Pernambuco
          </div>

          <h1 className="text-6xl font-black tracking-tight leading-[1.05] mb-6 max-w-3xl">
            Eventos da{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Arena Pernambuco
            </span>
          </h1>

          <p className="text-white/50 text-lg max-w-xl mb-10 leading-relaxed">
            Plataforma completa para consulta e gestão de eventos. Participe, sugira e acompanhe toda a programação.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/eventos"
              className={arenaTheme.primaryButton}
            >
              <CalendarDays size={16} />
              Ver Eventos
            </Link>
            <Link
              href="/fale-conosco"
              className={arenaTheme.secondaryButton}
            >
              Fale Conosco
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-8 pb-20">
        <div className={arenaTheme.heroContainer + " grid grid-cols-4 gap-4"}>
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className={arenaTheme.glassCard + " relative p-6 hover:border-violet-500/30 hover:bg-white/5 transition-all group"}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <Icon size={18} className="text-violet-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{value}</div>
              <div className="text-sm text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROXIMOS EVENTOS */}
      <section className="px-8 pb-24">
        <div className={arenaTheme.heroContainer}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Próximos Eventos</h2>
              <p className="text-white/40 text-sm mt-1">Confira os eventos mais aguardados</p>
            </div>
            <Link
              href="/eventos"
              className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={arenaTheme.glassCard + " overflow-hidden"}
                >
                  <Skeleton className="h-48 w-full rounded-none rounded-t-2xl" />
                  <div className="p-5">
                    <Skeleton className="mb-3 h-5 w-48" />
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
              featuredEvents.map((event) => (
                <EventCard
                  key={event.idEvento ?? event.eventName}
                  evento={event}
                  href={event.idEvento ? `/eventos/${event.idEvento}` : "/eventos"}
                />
              ))
            )}
          </div>

          {error && !loading && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              href="/eventos"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Ver Todos os Eventos
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </ArenaPageLayout>
  );
}
