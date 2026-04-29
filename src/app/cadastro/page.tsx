"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/api";
import { arenaTheme } from "@/lib/arena-theme";

export default function Cadastro() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const username = (formData.get("username") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !username || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (name.length < 3) {
      toast.error("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (username.length < 3) {
      toast.error("O nome de usuário deve ter pelo menos 3 caracteres");
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

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, username, email, password });
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta");
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
                Criar conta
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Preencha os dados abaixo para se cadastrar.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-white/80"
                >
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  className={arenaTheme.input + " mt-1.5 h-11 py-2"}
                />
              </div>

              <div>
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-white/80"
                >
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="seuusuario"
                  autoComplete="username"
                  className={arenaTheme.input + " mt-1.5 h-11 py-2"}
                />
              </div>

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

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-white/80"
                >
                  Senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={arenaTheme.input + " h-11 py-2 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-white/80"
                >
                  Confirmar senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={arenaTheme.input + " h-11 py-2 pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>

              <div className="mt-2 text-center">
                <span className="text-sm text-white/50">
                  Já tem uma conta?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-sm font-medium text-violet-300 hover:text-violet-200"
                >
                  Entrar
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
