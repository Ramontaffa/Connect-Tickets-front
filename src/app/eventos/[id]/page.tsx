import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Ticket, DollarSign } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { listEventos, getEvento } from "@/lib/api";

const CATEGORY_META: Record<string, { label: string; fallbackImage: string }> = {
  ESPORTE: {
    label: "Esporte",
    fallbackImage:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1400&q=80",
  },
  SHOW: {
    label: "Show",
    fallbackImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80",
  },
  CULTURAL: {
    label: "Cultural",
    fallbackImage:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1400&q=80",
  },
  CORPORATIVO: {
    label: "Corporativo",
    fallbackImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
  },
};

function formatDate(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(isFree?: boolean, price?: number): string {
  if (isFree) return "Gratuito";
  if (price != null) {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  return "Sob consulta";
}

function getOccupancy(eventCapacity: number, expectedAttendance: number): number {
  if (!eventCapacity) return 0;
  return Math.round((expectedAttendance / eventCapacity) * 100);
}

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isFinite(eventId)) {
    notFound();
  }

  const evento = await getEvento(eventId).catch(() => null);

  if (!evento) {
    notFound();
  }

  const categoryMeta = CATEGORY_META[evento.category] ?? CATEGORY_META.ESPORTE;
  const imageUrl = evento.imageUrl?.trim() || categoryMeta.fallbackImage;
  const occupancy = getOccupancy(evento.capacity, evento.expectedAttendance);

  return (
    <ArenaPageLayout active="eventos">
      <div className="mb-6">
        <Link href="/eventos" className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white">
          <ArrowLeft size={16} />
          Voltar para eventos
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="overflow-hidden rounded-2xl border border-arena-border bg-arena-surface">
          <div className="relative h-80 overflow-hidden">
            <img src={imageUrl} alt={evento.eventName} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
              {categoryMeta.label}
            </span>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">Detalhes do evento</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">{evento.eventName}</h1>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <p className="max-w-3xl text-sm leading-7 text-white/60">
              {evento.description || "Este evento ainda não possui uma descrição pública cadastrada."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  <CalendarDays size={14} />
                  Data
                </div>
                <p className="text-sm font-semibold text-white">{formatDate(evento.scheduledAt)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  <Clock size={14} />
                  Horário
                </div>
                <p className="text-sm font-semibold text-white">{formatTime(evento.scheduledAt)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  <MapPin size={14} />
                  Local
                </div>
                <p className="text-sm font-semibold text-white">{evento.locationDetail || "Local não informado"}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  <DollarSign size={14} />
                  Valor
                </div>
                <p className="text-sm font-semibold text-white">{formatPrice(evento.isFree, evento.price)}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-arena-border bg-arena-surface p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Resumo</p>
            <p className="mt-2 text-2xl font-black text-white">{occupancy}% de ocupação</p>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${occupancy >= 90 ? "bg-linear-to-r from-red-500 to-orange-500" : occupancy >= 75 ? "bg-linear-to-r from-amber-500 to-yellow-500" : "bg-linear-to-r from-violet-500 to-fuchsia-500"}`}
              style={{ width: `${occupancy}%` }}
            />
          </div>

          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
              <span className="inline-flex items-center gap-2">
                <Users size={14} />
                Público esperado
              </span>
              <strong className="text-white">{evento.expectedAttendance.toLocaleString("pt-BR")}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
              <span className="inline-flex items-center gap-2">
                <Ticket size={14} />
                Capacidade
              </span>
              <strong className="text-white">{evento.capacity.toLocaleString("pt-BR")}</strong>
            </div>
          </div>

          <Link
            href="/fale-conosco"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Fale conosco sobre este evento
          </Link>
        </aside>
      </div>
    </ArenaPageLayout>
  );
}