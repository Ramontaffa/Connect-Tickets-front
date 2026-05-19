"use client";

import { useState } from "react";
import { Ticket, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/use-auth";
import { useAuthRedirect } from "@/lib/auth-redirect";
import { getToken } from "@/lib/auth-session";
import { createInscricao } from "@/lib/api";

interface InscricaoButtonProps {
  eventId: number;
  eventName: string;
}

export function InscricaoButton({ eventId, eventName }: InscricaoButtonProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const redirectToLogin = useAuthRedirect();
  const [open, setOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [inscrito, setInscrito] = useState(false);

  function handleClick() {
    if (!isAuthenticated) {
      redirectToLogin(`/eventos/${eventId}`);
      return;
    }
    setOpen(true);
  }

  async function handleSubmit() {
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
      await createInscricao(
        {
          userId: user.id,
          eventId,
          visitorCount,
          registrationAt: new Date().toISOString(),
        },
        token
      );

      setInscrito(true);
      setOpen(false);
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
    return (
      <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
    );
  }

  if (inscrito) {
    return (
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold text-white/60 cursor-default">
        <CheckCircle2 size={16} className="text-emerald-400" />
        Inscrito com sucesso
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Ticket size={16} />
        Inscrever-se neste evento
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl border border-white/10 bg-[#0f0f17] text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Confirmar inscrição
            </DialogTitle>
            <DialogDescription className="text-sm text-white/50">
              {eventName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="visitorCount" className="text-sm font-medium text-white/80">
              Quantidade de visitantes
            </Label>
            <Input
              id="visitorCount"
              type="number"
              min={1}
              value={visitorCount}
              onChange={(e) => setVisitorCount(Math.max(1, Number(e.target.value)))}
              className="h-11 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-violet-500/60 focus:outline-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="rounded-xl text-white/60 hover:text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                "Confirmar inscrição"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
