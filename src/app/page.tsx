"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarDays, Shield, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tab = "user" | "admin";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("user");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Digite um email válido");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // TODO: integrar com API de login
    toast.info("Realizando login...");
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
            <div className="mb-8 grid w-full grid-cols-2 rounded-xl bg-muted p-0.75">
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className={`flex items-center cursor-pointer justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "user"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="cursor-pointer">Usuário</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center cursor-pointer justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "admin"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span className="cursor-pointer">Admin</span>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor={`${activeTab}-email`}
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  key={`${activeTab}-email`}
                  id={`${activeTab}-email`}
                  name="email"
                  type="email"
                  placeholder={`${activeTab}@email.com`}
                  autoComplete="email"
                  className="mt-1.5 border-0 bg-gray-100"
                />
              </div>

              <div>
                <Label
                  htmlFor={`${activeTab}-password`}
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </Label>
                <Input
                  key={`${activeTab}-password`}
                  id={`${activeTab}-password`}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="mt-1.5 border-0 bg-gray-100"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-6 w-full rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                Entrar
              </Button>

              <div className="mt-2 text-center">
                <Link
                  href="/esqueci-senha"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Esqueceu a senha?
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
