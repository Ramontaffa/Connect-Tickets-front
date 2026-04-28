"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Shield, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { arenaTheme } from "@/lib/arena-theme";

type Tab = "user" | "admin";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("user");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email ou senha incorretos");
        return;
      }

      toast.success("Bem-vindo!");
      router.push(activeTab === "admin" ? "/admin/dashboard" : "/home");
    } catch {
      toast.error("Erro ao fazer login. Tente novamente.");
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
            <div className="mb-8 grid w-full grid-cols-2 rounded-xl border border-arena-border bg-arena-surface-strong p-1">
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className={`flex items-center cursor-pointer justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "user"
                    ? "bg-linear-to-r from-arena-brand-start to-arena-brand-end text-white"
                    : "text-white/50 hover:text-white"
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
                    ? "bg-linear-to-r from-arena-brand-start to-arena-brand-end text-white"
                    : "text-white/50 hover:text-white"
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
                  className="text-sm font-medium text-white/80"
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
                  className={arenaTheme.input + " mt-1.5 h-11 py-2"}
                />
              </div>

              <div>
                <Label
                  htmlFor={`${activeTab}-password`}
                  className="text-sm font-medium text-white/80"
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
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="mt-2 text-center">
                <Link
                  href="/esqueci-senha"
                  className="text-sm text-white/60 hover:text-white"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="text-center">
                <span className="text-sm text-white/50">
                  Não tem uma conta?{" "}
                </span>
                <Link
                  href="/cadastro"
                  className="text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  Criar conta
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
