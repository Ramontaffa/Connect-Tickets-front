"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearSession, type AuthUser } from "@/lib/auth-session";

type NavKey = "home" | "eventos" | "fale-conosco" | "agendar-visita";

type ArenaTopNavProps = {
  active: NavKey;
  isAuthenticated?: boolean;
  user?: AuthUser | null;
};

const navItems = [
  { key: "home" as const, label: "Início", href: "/home" },
  { key: "eventos" as const, label: "Eventos", href: "/eventos" },
  {
    key: "fale-conosco" as const,
    label: "Fale Conosco",
    href: "/fale-conosco",
  },
  {
    key: "agendar-visita" as const,
    label: "Agendar Visita",
    href: "/agendar-visita",
  },
];

export function ArenaTopNav({ active, isAuthenticated = false, user }: ArenaTopNavProps) {
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN";

  function handleLogout() {
    clearSession();
    signOut({ callbackUrl: "/" });
  }

  function handleLogin() {
    router.push("/login");
  }

  function goToAdmin() {
    router.push("/admin/dashboard");
  }

  function goToUserArea() {
    router.push("/home");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-arena-border bg-arena-nav px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-arena-brand-start to-arena-brand-end text-xs font-bold">
          AP
        </div>
        <span className="text-arena-text font-semibold tracking-tight">Arena Pernambuco</span>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              active === item.key
                ? "bg-white/10 text-arena-text"
                : "text-white/50 hover:bg-white/5 hover:text-arena-text",
            )}
          >
            {item.label}
          </Link>
        ))}

        {isAuthenticated ? (
          <div className="ml-4 flex items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  type="button"
                  onClick={goToAdmin}
                  variant="outline"
                  className="rounded-lg border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  Tela admin
                </Button>
                <Button
                  type="button"
                  onClick={goToUserArea}
                  variant="outline"
                  className="rounded-lg border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  Tela do usuário
                </Button>
              </>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-arena-text"
            >
              Sair
            </button>
          </div>
        ) : (
          <Button
            onClick={handleLogin}
            variant="default"
            className="ml-4 rounded-lg border border-violet-500/20 bg-linear-to-r from-arena-brand-start to-arena-brand-end px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:opacity-90"
          >
            Entrar
          </Button>
        )}
      </div>
    </nav>
  );
}
