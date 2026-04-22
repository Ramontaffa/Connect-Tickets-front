"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arenaTheme } from "@/lib/arena-theme";

export default function EsqueciSenha() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Digite um email válido");
      return;
    }

    // TODO: integrar com API de recuperação de senha
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={arenaTheme.page + " relative flex min-h-screen items-center justify-center overflow-hidden p-4"}>
      <div className="pointer-events-none absolute left-1/4 top-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-arena-border bg-arena-surface-strong">
            <CalendarDays className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
            Arena Pernambuco
          </h1>
          <p className={arenaTheme.mutedText}>Plataforma de Gestão de Eventos</p>
        </div>

        <Card className={arenaTheme.glassCard + " rounded-3xl py-0 shadow-none backdrop-blur-sm"}>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Recuperar senha
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Digite seu email para receber o link de recuperação de senha.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-white/80"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className={arenaTheme.input + " mt-1.5 h-11 py-2"}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className={arenaTheme.primaryButton + " mt-6 h-12 w-full rounded-xl px-0 disabled:opacity-70"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link"
                )}
              </Button>

              <div className="mt-2 text-center">
                <Link
                  href="/"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Voltar para o login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/40">
            © 2026 Arena Pernambuco. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
