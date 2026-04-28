"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Users } from "lucide-react";

import type { EventoDTO } from "@/lib/api";

const CATEGORY_META: Record<string, { label: string; chipClass: string; fallbackImage: string }> = {
  ESPORTE: {
    label: "Esporte",
    chipClass: "bg-emerald-500",
    fallbackImage:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
  },
  SHOW: {
    label: "Show",
    chipClass: "bg-pink-500",
    fallbackImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
  },
  CULTURAL: {
    label: "Cultural",
    chipClass: "bg-amber-500",
    fallbackImage:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200&q=80",
  },
  CORPORATIVO: {
    label: "Corporativo",
    chipClass: "bg-blue-500",
    fallbackImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
  },
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

function getOccupancyLabel(occupancy: number): string {
  if (occupancy >= 90) return "Quase lotado";
  if (occupancy >= 75) return "Alta demanda";
  return "Disponível";
}

function getOccupancyLabelClass(occupancy: number): string {
  if (occupancy >= 90) return "text-red-400";
  if (occupancy >= 75) return "text-amber-400";
  return "text-emerald-400";
}

function getOccupancyBarClass(occupancy: number): string {
  if (occupancy >= 90) return "bg-linear-to-r from-red-500 to-orange-500";
  if (occupancy >= 75) return "bg-linear-to-r from-amber-500 to-yellow-500";
  return "bg-linear-to-r from-violet-500 to-fuchsia-500";
}

function getEventImage(evento: EventoDTO): string {
  return evento.imageUrl?.trim() || CATEGORY_META[evento.category]?.fallbackImage || CATEGORY_META.ESPORTE.fallbackImage;
}

type EventCardProps = {
  evento: EventoDTO;
  href: string;
};

export function EventCard({ evento, href }: EventCardProps) {
  const occupancy = evento.capacity > 0 ? Math.round((evento.expectedAttendance / evento.capacity) * 100) : 0;
  const categoryMeta = CATEGORY_META[evento.category] ?? CATEGORY_META.ESPORTE;

  return (
    <div className="group overflow-hidden rounded-2xl border border-arena-border bg-arena-surface transition-all hover:-translate-y-1 hover:border-violet-500/30">
      <div className="relative h-52 overflow-hidden">
        <img
          src={getEventImage(evento)}
          alt={evento.eventName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${categoryMeta.chipClass}`}>
          {categoryMeta.label}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="mb-1 flex justify-between text-xs text-white/60">
            <span>{occupancy}% lotação</span>
            <span className={getOccupancyLabelClass(occupancy)}>{getOccupancyLabel(occupancy)}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/20">
            <div className={`h-full rounded-full transition-all ${getOccupancyBarClass(occupancy)}`} style={{ width: `${occupancy}%` }} />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="mb-3 text-base font-bold leading-tight text-white">{evento.eventName}</h3>
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <CalendarDays size={12} />
            {formatDate(evento.scheduledAt)}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Clock size={12} />
            {formatTime(evento.scheduledAt)}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Users size={12} />
            {evento.expectedAttendance.toLocaleString("pt-BR")} participantes
          </div>
        </div>
        <Link
          href={href}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-linear-to-r from-violet-600/20 to-fuchsia-600/20 py-2.5 text-center text-sm font-semibold text-violet-300 transition-all hover:border-transparent hover:from-violet-600 hover:to-fuchsia-600 hover:text-white"
        >
          Ver Detalhes
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}