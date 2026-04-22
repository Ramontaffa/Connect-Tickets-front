import Link from "next/link";

import { cn } from "@/lib/utils";

type NavKey = "home" | "eventos" | "agendar-visita";

type ArenaTopNavProps = {
  active: NavKey;
};

const navItems = [
  { key: "home" as const, label: "Início", href: "/home" },
  { key: "eventos" as const, label: "Eventos", href: "/eventos" },
  { key: "sugerir" as const, label: "Sugerir", href: "/sugerir" },
  {
    key: "agendar-visita" as const,
    label: "Agendar Visita",
    href: "/agendar-visita",
  },
];

export function ArenaTopNav({ active }: ArenaTopNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[var(--arena-border)] bg-[var(--arena-nav)] px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[var(--arena-brand-start)] to-[var(--arena-brand-end)] text-xs font-bold">
          AP
        </div>
        <span className="text-[var(--arena-text)] font-semibold tracking-tight">Arena Pernambuco</span>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              active === item.key
                ? "bg-white/10 text-[var(--arena-text)]"
                : "text-white/50 hover:bg-white/5 hover:text-[var(--arena-text)]",
            )}
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/"
          className="ml-4 rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-[var(--arena-text)]"
        >
          Sair
        </Link>
      </div>
    </nav>
  );
}
