"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Users, SlidersHorizontal, ArrowRight, Search } from "lucide-react";

const ALL_EVENTS = [
  {
    id: 1,
    title: "Campeonato Estadual de Futebol",
    category: "Esporte",
    date: "24 de março de 2026",
    dateSort: "2026-03-24",
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
    dateSort: "2026-03-31",
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
    dateSort: "2026-04-09",
    time: "18:00",
    participants: "18.300",
    occupancy: 73,
    image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
    categoryColor: "bg-amber-500",
  },
  {
    id: 4,
    title: "Festival de Música Internacional",
    category: "Show",
    date: "19 de abril de 2026",
    dateSort: "2026-04-19",
    time: "20:00",
    participants: "32.500",
    occupancy: 72,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    categoryColor: "bg-pink-500",
  },
  {
    id: 5,
    title: "Congresso de Tecnologia e Inovação",
    category: "Corporativo",
    date: "14 de maio de 2026",
    dateSort: "2026-05-14",
    time: "09:00",
    participants: "12.800",
    occupancy: 85,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    categoryColor: "bg-blue-500",
  },
  {
    id: 6,
    title: "Show de Rock Nacional",
    category: "Show",
    date: "04 de junho de 2026",
    dateSort: "2026-06-04",
    time: "21:00",
    participants: "28.900",
    occupancy: 72,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    categoryColor: "bg-pink-500",
  },
];

const CATEGORIES = ["Todos", "Esporte", "Cultural", "Show", "Corporativo"];
const ORDER_OPTIONS = ["Data", "Lotação", "Participantes"];

export default function EventosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [order, setOrder] = useState("Data");

  const filtered = ALL_EVENTS
    .filter((e) => {
      const matchCat = category === "Todos" || e.category === category;
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (order === "Data") return a.dateSort.localeCompare(b.dateSort);
      if (order === "Lotação") return b.occupancy - a.occupancy;
      return parseInt(b.participants.replace(".", "")) - parseInt(a.participants.replace(".", ""));
    });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold">AP</div>
          <span className="font-semibold tracking-tight text-white">Arena Pernambuco</span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: "Início", href: "/home" },
            { label: "Eventos", href: "/eventos", active: true },
            { label: "Sugerir", href: "/sugerir" },
            { label: "Agendar Visita", href: "/agendar-visita" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                item.active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
            Sair
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-5xl font-black tracking-tight mb-2">
              Todos os{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Eventos
              </span>
            </h1>
            <p className="text-white/40">Encontre o evento perfeito para você</p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Buscar evento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/8">
              <SlidersHorizontal size={13} className="text-white/30 ml-2" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? "bg-violet-600 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Order */}
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none cursor-pointer"
            >
              {ORDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0a0a0f]">{opt}</option>
              ))}
            </select>
          </div>

          {/* COUNT */}
          <p className="text-white/30 text-sm mb-6">
            Exibindo <span className="text-white/60 font-semibold">{filtered.length}</span> evento{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="group rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-violet-500/30 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${event.categoryColor}`}>
                    {event.category}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>{event.occupancy}% lotação</span>
                      <span className={event.occupancy >= 90 ? "text-red-400" : event.occupancy >= 75 ? "text-amber-400" : "text-emerald-400"}>
                        {event.occupancy >= 90 ? "Quase lotado" : event.occupancy >= 75 ? "Alta demanda" : "Disponível"}
                      </span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          event.occupancy >= 90 ? "bg-gradient-to-r from-red-500 to-orange-500" :
                          event.occupancy >= 75 ? "bg-gradient-to-r from-amber-500 to-yellow-500" :
                          "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        }`}
                        style={{ width: `${event.occupancy}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-white mb-3 leading-tight text-base">{event.title}</h3>
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
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-violet-300 hover:from-violet-600 hover:to-fuchsia-600 hover:text-white hover:border-transparent transition-all"
                  >
                    Ver Detalhes
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-white/30 text-sm">Nenhum evento encontrado para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
