"use client";

import { useState, useEffect } from "react";
import { Ticket, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/use-auth";
import { useAuthRedirect } from "@/lib/auth-redirect";
import { getToken } from "@/lib/auth-session";
import { createInscricao, listMinhasInscricoes } from "@/lib/api";
import { arenaTheme } from "@/lib/arena-theme";

interface InscricaoButtonProps {
  eventId: number;
  eventName: string;
}

export function InscricaoButton({ eventId, eventName: _eventName }: InscricaoButtonProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const redirectToLogin = useAuthRedirect();
  const [submitting, setSubmitting] = useState(false);
  const [inscrito, setInscrito] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    const token = getToken();
    if (!token) return;

    listMinhasInscricoes(token)
      .then((inscricoes) => {
        if (inscricoes.some((i) => i.idEvento === eventId)) {
          setInscrito(true);
        }
      })
      .catch(() => {});
  }, [isAuthenticated, isLoading, eventId]);

  async function handleClick() {
    if (!isAuthenticated) {
      redirectToLogin(`/eventos/${eventId}`);
      return;
    }

    if (!user?.id) {
      toast.error("Não foi possível identificar o usuário. Faça login novamente.");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      redirectToLogin(`/eventos/${eventId}`);
      return;
    }

    setSubmitting(true);
    try {
      await createInscricao({ userId: user.id, eventId, visitorCount: 1 }, token);
      setInscrito(true);
      toast.success("Inscrição realizada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao realizar inscrição. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />;
  }

  if (inscrito) {
    return (
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/60">
        <CheckCircle size={16} className="text-emerald-400" />
        Inscrito com sucesso
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={submitting}
      className={arenaTheme.primaryButton + " w-full py-3 px-6 disabled:opacity-60"}
    >
      {submitting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Inscrevendo...
        </>
      ) : (
        <>
          <Ticket size={16} />
          Inscrever-se neste evento
        </>
      )}
    </button>
  );
}
