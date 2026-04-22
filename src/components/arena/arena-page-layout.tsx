import type { ReactNode } from "react";

import { ArenaTopNav } from "@/components/arena/arena-top-nav";
import { arenaTheme } from "@/lib/arena-theme";
import { cn } from "@/lib/utils";

type ArenaPageLayoutProps = {
  active: "home" | "eventos" | "agendar-visita";
  children: ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  topDecoration?: ReactNode;
};

export function ArenaPageLayout({
  active,
  children,
  contentClassName,
  containerClassName,
  topDecoration,
}: ArenaPageLayoutProps) {
  return (
    <div className={arenaTheme.page}>
      <ArenaTopNav active={active} />
      {topDecoration}

      <div className={cn(arenaTheme.pageContent, contentClassName)}>
        <div className={cn(arenaTheme.container, containerClassName)}>{children}</div>
      </div>
    </div>
  );
}
