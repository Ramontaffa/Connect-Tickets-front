"use client";

import { useState } from "react";
import { CalendarDays, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tab = "user" | "admin";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("user");

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

        <Card className="rounded-2xl border-none shadow-lg ring-0">
          <CardContent className="p-8">
            <div className="mb-6 grid w-full grid-cols-2 rounded-xl bg-muted p-0.75">
              <button
                type="button"
                onClick={() => setActiveTab("user")}
                className={`flex items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "user"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Usuário</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "admin"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </button>
            </div>

            <form className="space-y-4">
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
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="mt-1.5 border-0 bg-gray-100"
                />
              </div>

              <Button
                type="submit"
                className="mt-6 w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800"
              >
                Entrar
              </Button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Esqueceu a senha?
                </button>
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
