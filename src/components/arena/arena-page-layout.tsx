"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { ArenaTopNav } from "@/components/arena/arena-top-nav";
import { arenaTheme } from "@/lib/arena-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

type ArenaPageLayoutProps = {
  active: "home" | "eventos" | "fale-conosco" | "agendar-visita";
  children: ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  topDecoration?: ReactNode;
  isAuthenticated?: boolean;
};

export function ArenaPageLayout({
  active,
  children,
  contentClassName,
  containerClassName,
  topDecoration,
  isAuthenticated: providedAuth,
}: ArenaPageLayoutProps) {
  // Detecta autenticação usando hook se não foi fornecida via prop
  const { isAuthenticated: detectedAuth } = useAuth();
  const isAuthenticated = providedAuth !== undefined ? providedAuth : detectedAuth;

  return (
    <div className={arenaTheme.page}>
      <ArenaTopNav active={active} isAuthenticated={isAuthenticated} />
      {topDecoration}

      <div className={cn(arenaTheme.pageContent, contentClassName)}>
        <div className={cn(arenaTheme.container, containerClassName)}>{children}</div>
      </div>
    </div>
  );
}
