"use client";

import Link from "next/link";
import { CalendarDays, Users, TrendingUp, MapPin, ArrowRight, Clock } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { arenaTheme } from "@/lib/arena-theme";

const stats = [
  { icon: CalendarDays, value: "6", label: "Eventos Disponíveis" },
  { icon: Users, value: "158K", label: "Participantes Totais" },
  { icon: TrendingUp, value: "45K", label: "Capacidade Máxima" },
  { icon: MapPin, value: "365", label: "Dias de Evento/Ano" },
];

const events = [
  {
    id: 1,
    title: "Campeonato Estadual de Futebol",
    category: "Esporte",
    date: "24 de março de 2026",
    time: "16:00",
    participants: "41.200",
    occupancy: 92,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
    categoryColor: "bg-emerald-500",
  },
  {
    id: 2,
    title: "Torneio de Basquete",
    category: "Esporte",
    date: "31 de março de 2026",
    time: "19:00",
    participants: "22.400",
    occupancy: 75,
    image: "https://images.unsplash.com/photo-1546519638405-a0c3ef2a0f6e?w=600&q=80",
    categoryColor: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Mostra Cultural Nordestina",
    category: "Cultural",
    date: "09 de abril de 2026",
    time: "18:00",
    participants: "18.300",
    occupancy: 73,
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
    categoryColor: "bg-amber-500",
  },
];

export default function HomePage() {
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
              href="/sugerir"
              className={arenaTheme.secondaryButton}
            >
              Sugerir Evento
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
            {events.map((event) => (
              <div
                key={event.id}
                className={arenaTheme.glassCard + " group overflow-hidden hover:border-violet-500/30 transition-all hover:-translate-y-1 duration-300"}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${event.categoryColor}`}>
                    {event.category}
                  </span>
                  {/* Occupancy bar */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>{event.occupancy}% lotação</span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full"
                        style={{ width: `${event.occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-white mb-3 leading-tight">{event.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <CalendarDays size={12} />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Clock size={12} />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Users size={12} />
                      {event.participants} participantes
                    </div>
                  </div>
                  <Link
                    href={`/eventos/${event.id}`}
                    className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-linear-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-violet-300 hover:from-violet-600 hover:to-fuchsia-600 hover:text-white hover:border-transparent transition-all"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>

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
