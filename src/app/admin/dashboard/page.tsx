"use client";

import Link from "next/link";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Star,
  PlusCircle,
  MessageSquare,
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

const events = [
  {
    id: 1,
    title: "Festival de Música Internacional",
    category: "Show",
    date: "19/04/2026",
    time: "20:00",
    participants: "32.500",
    occupancy: 72,
  },
  {
    id: 2,
    title: "Campeonato Estadual de Futebol",
    category: "Esporte",
    date: "24/03/2026",
    time: "16:00",
    participants: "41.200",
    occupancy: 92,
  },
  {
    id: 3,
    title: "Mostra Cultural Nordestina",
    category: "Cultural",
    date: "10/05/2026",
    time: "14:00",
    participants: "15.800",
    occupancy: 35,
  },
  {
    id: 4,
    title: "Congresso de Tecnologia",
    category: "Corporativo",
    date: "15/06/2026",
    time: "09:00",
    participants: "8.300",
    occupancy: 55,
  },
  {
    id: 5,
    title: "Show de Rock Nacional",
    category: "Show",
    date: "04/06/2026",
    time: "21:00",
    participants: "28.900",
    occupancy: 64,
  },
  {
    id: 6,
    title: "Torneio de Basquete",
    category: "Esporte",
    date: "20/07/2026",
    time: "18:00",
    participants: "20.400",
    occupancy: 45,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Show: "#8b5cf6",
  Esporte: "#10b981",
  Cultural: "#f97316",
  Corporativo: "#3b82f6",
};

function parseParticipants(value: string): number {
  return parseInt(value.replace(/\./g, ""), 10);
}

function buildStats() {
  const total = events.length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + parseParticipants(e.participants),
    0,
  );
  const avgParticipants = Math.round(totalParticipants / total);
  const avgOccupancy = Math.round(
    events.reduce((sum, e) => sum + e.occupancy, 0) / total,
  );
  return { total, totalParticipants, avgParticipants, avgOccupancy };
}

function buildBarData() {
  return events.map((e) => ({
    name: e.title.split(" ")[0],
    participantes: parseParticipants(e.participants),
  }));
}

function buildPieData() {
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function buildTopEvents() {
  return [...events]
    .sort((a, b) => parseParticipants(b.participants) - parseParticipants(a.participants))
    .slice(0, 3);
}

export default function AdminDashboardPage() {
  const { total, totalParticipants, avgParticipants, avgOccupancy } = buildStats();
  const barData = buildBarData();
  const pieData = buildPieData();
  const topEvents = buildTopEvents();

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
      <div className="mb-8 grid grid-cols-2 gap-4">
        <Link
          href="/admin/eventos/cadastrar"
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <PlusCircle size={16} />
          Cadastrar Novo Evento
        </Link>
        <Link
          href="#"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          <MessageSquare size={16} />
          Ver Sugestões de Eventos
        </Link>
      </div>

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
        <div className="space-y-0">
          {topEvents.map((event, idx) => (
            <div key={event.id}>
              <div className="flex items-center gap-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {event.date} &bull; {event.time}
                  </p>
                </div>
                <div className="shrink-0 text-sm font-semibold text-gray-900">
                  {parseParticipants(event.participants).toLocaleString("pt-BR")}
                </div>
              </div>
              {idx < topEvents.length - 1 && (
                <div className="h-px bg-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </ArenaPageLayout>
  );
}
