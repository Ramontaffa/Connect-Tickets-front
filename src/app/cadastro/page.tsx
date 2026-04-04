"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (name.length < 3) {
      toast.error("O nome deve ter pelo menos 3 caracteres");
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

    // TODO: integrar com API de cadastro
    toast.success("Conta criada com sucesso!");
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
                Criar conta
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Preencha os dados abaixo para se cadastrar.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  className="mt-1.5 border-0 bg-gray-100"
                />
              </div>

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

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
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
                    className="border-0 bg-gray-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  className="text-sm font-medium text-gray-700"
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
                    className="border-0 bg-gray-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                className="mt-6 w-full rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                Criar conta
              </Button>

              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500">
                  Já tem uma conta?{" "}
                </span>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Entrar
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
