"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900">
            <CalendarDays className="h-9 w-9 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Arena Pernambuco
          </h1>
          <p className="text-gray-600">Plataforma de Gestão de Eventos</p>
        </div>

        <Card className="rounded-2xl border-none py-0 shadow-lg ring-0">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recuperar senha
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Digite seu email para receber o link de recuperação de senha.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="mt-1.5 border-0 bg-gray-100"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="mt-6 w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-70"
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
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Voltar para o login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Arena Pernambuco. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}
