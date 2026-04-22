export const arenaTheme = {
  page: "min-h-screen bg-[var(--arena-bg)] text-[var(--arena-text)]",
  pageContent: "pt-28 pb-24 px-8",
  container: "mx-auto w-full max-w-6xl",
  heroContainer: "mx-auto w-full max-w-5xl",
  glassCard:
    "rounded-2xl bg-[var(--arena-surface)] border border-[var(--arena-border)]",
  glassCardHover:
    "rounded-2xl bg-[var(--arena-surface)] border border-[var(--arena-border)] hover:border-violet-500/30 transition-all",
  mutedText: "text-[var(--arena-text-muted)]",
  input:
    "w-full px-4 py-3 rounded-xl bg-[var(--arena-surface-strong)] border border-[var(--arena-border-strong)] text-[var(--arena-text)] placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all",
  primaryButton:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[var(--arena-brand-start)] to-[var(--arena-brand-end)] text-[var(--arena-text)] font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25",
  secondaryButton:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-[var(--arena-border-strong)] text-[var(--arena-text)] font-semibold text-sm hover:bg-white/10 transition-colors",
};
