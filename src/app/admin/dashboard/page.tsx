"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Star,
  PlusCircle,
  MessageSquare,
  List,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { listEventos, type EventoDTO } from "@/lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  Show: "#8b5cf6",
  Esporte: "#10b981",
  Cultural: "#f97316",
  Corporativo: "#3b82f6",
};

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

function calcOccupancy(evento: EventoDTO): number {
  if (!evento.capacity || evento.capacity === 0) return 0;
  return Math.round((evento.expectedAttendance / evento.capacity) * 100);
}

function buildStats(events: EventoDTO[]) {
  const total = events.length;
  if (total === 0) return { total: 0, totalParticipants: 0, avgParticipants: 0, avgOccupancy: 0 };

  const totalParticipants = events.reduce((sum, e) => sum + e.expectedAttendance, 0);
  const avgParticipants = Math.round(totalParticipants / total);
  const avgOccupancy = Math.round(
    events.reduce((sum, e) => sum + calcOccupancy(e), 0) / total
  );
  return { total, totalParticipants, avgParticipants, avgOccupancy };
}

function buildBarData(events: EventoDTO[]) {
  return events.map((e) => ({
    name: e.eventName.split(" ")[0],
    participantes: e.expectedAttendance,
  }));
}

function buildPieData(events: EventoDTO[]) {
  const counts: Record<string, number> = {};
  for (const e of events) {
    const label = CATEGORY_LABELS[e.category] ?? e.category;
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildTopEvents(events: EventoDTO[]) {
  return [...events]
    .sort((a, b) => b.expectedAttendance - a.expectedAttendance)
    .slice(0, 3);
}

export default function AdminDashboardPage() {
  useSession();
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

  const { total, totalParticipants, avgParticipants, avgOccupancy } = buildStats(events);
  const barData = buildBarData(events);
  const pieData = buildPieData(events);
  const topEvents = buildTopEvents(events);

  const statCards = [
    {
      label: "Total de Eventos",
      value: total.toLocaleString("pt-BR"),
      icon: CalendarDays,
    },
    {
      label: "Total de Participantes",
      value: totalParticipants.toLocaleString("pt-BR"),
      icon: Users,
    },
    {
      label: "Média de Participantes",
      value: avgParticipants.toLocaleString("pt-BR"),
      icon: TrendingUp,
    },
    {
      label: "Taxa de Ocupação",
      value: `${avgOccupancy}%`,
      icon: Star,
    },
  ];

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
      containerClassName="mx-auto w-full max-w-6xl"
    >
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Dashboard Administrativo
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral e estatísticas dos eventos
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Link
          href="/admin/eventos/cadastrar"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <PlusCircle size={16} />
          Cadastrar Novo Evento
        </Link>
        <Link
          href="/admin/eventos"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-900 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          <List size={16} />
          Gerenciar Eventos
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          <MessageSquare size={16} />
          Ver Sugestões de Eventos
        </Link>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <>
          {/* Stat cards skeleton */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl border border-gray-200 bg-white p-6">
                <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
                <Skeleton className="mb-2 h-7 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="mb-8 flex gap-4">
            <div className="flex-[55] rounded-xl border border-gray-200 bg-white p-6">
              <Skeleton className="mb-6 h-5 w-48" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
            <div className="flex-[45] rounded-xl border border-gray-200 bg-white p-6">
              <Skeleton className="mb-6 h-5 w-40" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>

          {/* Top events skeleton */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Skeleton className="mb-6 h-5 w-44" />
            <div className="space-y-0">
              {[1, 2, 3].map((n, idx) => (
                <div key={n}>
                  <div className="flex items-center gap-4 py-4">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  {idx < 2 && <div className="h-px bg-gray-100" />}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Icon size={18} className="text-gray-700" />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className="mt-1 text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div className="mb-8 flex gap-4">
            {/* Bar Chart */}
            <div className="flex-[55] rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Participantes por Evento
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => v.toLocaleString("pt-BR")}
                  />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === "number"
                        ? value.toLocaleString("pt-BR")
                        : value,
                      "Participantes",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="participantes" fill="#1e293b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="flex-[45] rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Distribuição por Tipo
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value: string) => {
                      const item = pieData.find((d) => d.name === value);
                      const pct = item
                        ? Math.round((item.value / events.length) * 100)
                        : 0;
                      return (
                        <span style={{ fontSize: "12px", color: "#374151" }}>
                          {value} {pct}%
                        </span>
                      );
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP EVENTS */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Eventos Mais Populares
            </h2>
            {topEvents.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum evento cadastrado.</p>
            ) : (
              <div className="space-y-0">
                {topEvents.map((event, idx) => (
                  <div key={event.idEvento ?? idx}>
                    <div className="flex items-center gap-4 py-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {event.eventName}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatDate(event.scheduledAt)} &bull; {formatTime(event.scheduledAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-sm font-semibold text-gray-900">
                        {event.expectedAttendance.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    {idx < topEvents.length - 1 && (
                      <div className="h-px bg-gray-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </ArenaPageLayout>
  );
}
