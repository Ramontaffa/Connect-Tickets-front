"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Ticket, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { arenaTheme } from "@/lib/arena-theme";
import { useAuth } from "@/lib/use-auth";
import { useAuthRedirect } from "@/lib/auth-redirect";
import { getToken } from "@/lib/auth-session";
import { listMinhasInscricoes, type InscricaoResponseDTO } from "@/lib/api";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MinhasInscricoesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const redirectToLogin = useAuthRedirect();
  const [inscricoes, setInscricoes] = useState<InscricaoResponseDTO[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      redirectToLogin("/minhas-inscricoes");
      return;
    }

    const token = getToken();
    if (!token) {
      redirectToLogin("/minhas-inscricoes");
      return;
    }

    listMinhasInscricoes(token)
      .then(setInscricoes)
      .catch(() => setInscricoes([]))
      .finally(() => setFetching(false));
  }, [isAuthenticated, isLoading, redirectToLogin]);

  const loading = isLoading || fetching;

  return (
    <ArenaPageLayout active="minhas-inscricoes">
      <div className="mb-8">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Ver todos os eventos
        </Link>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Ticket size={18} className="text-white/70" />
          </div>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/40">
            Área do usuário
          </p>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Minhas Inscrições</h1>
        <p className="mt-2 text-white/50 text-sm">
          Todos os eventos em que você se inscreveu.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : inscricoes.length === 0 ? (
        <div className={cn(arenaTheme.glassCard, "flex flex-col items-center gap-4 py-20 text-center")}>
          <Ticket size={36} className="text-white/20" />
          <p className="text-white/50 text-sm">Você ainda não se inscreveu em nenhum evento.</p>
          <Link href="/eventos" className={arenaTheme.primaryButton}>
            Explorar eventos
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inscricoes.map((inscricao) => (
            <div
              key={inscricao.idInscricao}
              className={cn(arenaTheme.glassCard, "flex items-center justify-between gap-4 px-6 py-5")}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <Ticket size={16} className="text-white/60" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{inscricao.eventName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={11} />
                      Inscrito em {formatDate(inscricao.registrationAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ticket size={11} />
                      {inscricao.visitorCount} {inscricao.visitorCount === 1 ? "ingresso" : "ingressos"}
                    </span>
                  </div>
                </div>
              </div>

              {inscricao.idEvento != null && (
                <Link
                  href={`/eventos/${inscricao.idEvento}`}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all"
                >
                  Ver evento
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </ArenaPageLayout>
  );
}
