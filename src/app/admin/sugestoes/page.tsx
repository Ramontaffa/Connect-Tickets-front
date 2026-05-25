"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquare,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteSugestao,
  listSugestoes,
  type SugestaoResponseDTO,
} from "@/lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  ESPORTE: "Esporte",
  SHOW: "Show",
  CULTURAL: "Cultural",
  CORPORATIVO: "Corporativo",
};

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  IGNORADA: "Ignorada",
  EM_ANALISE: "Em analise",
  REJEITADA: "Rejeitada",
};

const STATUS_STYLES: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 ring-amber-200",
  APROVADA: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  IGNORADA: "bg-gray-100 text-gray-600 ring-gray-200",
  EM_ANALISE: "bg-blue-50 text-blue-700 ring-blue-200",
  REJEITADA: "bg-red-50 text-red-700 ring-red-200",
};

type SuggestionFilter = "TODAS" | SugestaoResponseDTO["status"];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export default function AdminSugestoesPage() {
  const { data: session, status } = useSession();
  const [sugestoes, setSugestoes] = useState<SugestaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<SuggestionFilter>("TODAS");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sugestaoParaExcluir, setSugestaoParaExcluir] =
    useState<SugestaoResponseDTO | null>(null);

  const fetchSugestoes = useCallback(() => {
    const token = session?.accessToken;
    if (!token) {
      if (status === "loading") return;
      setLoading(false);
      return;
    }

    setLoading(true);
    listSugestoes(token)
      .then((data) => setSugestoes(data))
      .catch(() => setSugestoes([]))
      .finally(() => setLoading(false));
  }, [session?.accessToken, status]);

  useEffect(() => {
    fetchSugestoes();
  }, [fetchSugestoes]);

  const stats = useMemo(() => {
    const pendentes = sugestoes.filter((item) => item.status === "PENDENTE").length;
    const aprovadas = sugestoes.filter((item) => item.status === "APROVADA").length;
    const ignoradas = sugestoes.filter(
      (item) => item.status === "IGNORADA" || item.status === "REJEITADA"
    ).length;

    return [
      { label: "Total de sugestoes", value: sugestoes.length, icon: MessageSquare },
      { label: "Pendentes", value: pendentes, icon: Clock3 },
      { label: "Aprovadas", value: aprovadas, icon: CheckCircle2 },
      { label: "Ignoradas", value: ignoradas, icon: Inbox },
    ];
  }, [sugestoes]);

  const filteredSugestoes = useMemo(() => {
    const query = normalizeText(search.trim());

    return sugestoes.filter((sugestao) => {
      const matchesStatus =
        activeFilter === "TODAS" || sugestao.status === activeFilter;

      if (!matchesStatus) return false;
      if (!query) return true;

      const searchable = normalizeText(
        [
          sugestao.eventName,
          sugestao.description,
          sugestao.creatorName,
          getCategoryLabel(sugestao.category),
          getStatusLabel(sugestao.status),
        ].join(" ")
      );

      return searchable.includes(query);
    });
  }, [activeFilter, search, sugestoes]);

  async function confirmarExclusao() {
    if (!sugestaoParaExcluir?.idSugestao) return;

    const token = session?.accessToken;
    if (!token) {
      setSugestaoParaExcluir(null);
      return;
    }

    setDeletingId(sugestaoParaExcluir.idSugestao);
    setSugestaoParaExcluir(null);

    try {
      await deleteSugestao(sugestaoParaExcluir.idSugestao, token);
      setSugestoes((prev) =>
        prev.filter((item) => item.idSugestao !== sugestaoParaExcluir.idSugestao)
      );
    } catch {
      return;
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
      containerClassName="mx-auto w-full max-w-6xl"
    >
      <Dialog
        open={!!sugestaoParaExcluir}
        onOpenChange={(open) => {
          if (!open) setSugestaoParaExcluir(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <DialogTitle className="text-gray-900">Excluir sugestao</DialogTitle>
            <DialogDescription className="text-gray-500">
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-gray-900">
                &ldquo;{sugestaoParaExcluir?.eventName}&rdquo;
              </span>
              ? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setSugestaoParaExcluir(null)}
              className="rounded-lg border-gray-300 text-sm font-semibold text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarExclusao}
              className="rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar ao Dashboard
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
            <MessageSquare size={19} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Sugestoes de Eventos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe ideias enviadas pelo publico para a programacao da arena
          </p>
        </div>
        <Link
          href="/admin/eventos/cadastrar"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Cadastrar Evento
        </Link>
      </div>

      {loading ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl border border-gray-200 bg-white p-5">
                <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
                <Skeleton className="mb-2 h-6 w-14" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sugestao</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Categoria</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Autor</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4">
                      <Skeleton className="mb-2 h-4 w-48" />
                      <Skeleton className="h-3 w-72" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="ml-auto h-8 w-20 rounded-lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <Icon size={18} className="text-gray-700" />
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {value.toLocaleString("pt-BR")}
                </div>
                <div className="mt-1 text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome, autor ou descricao..."
                  className="h-10 rounded-lg border-gray-200 bg-gray-50 pl-9 text-sm text-gray-900"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(["TODAS", "PENDENTE", "APROVADA", "IGNORADA"] as SuggestionFilter[]).map(
                  (filter) => {
                    const isActive = activeFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-gray-900 text-white"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {filter === "TODAS" ? "Todas" : getStatusLabel(filter)}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {sugestoes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Inbox size={22} className="text-gray-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900">
                Nenhuma sugestao recebida.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                As sugestoes enviadas pelo Fale Conosco aparecerao aqui.
              </p>
            </div>
          ) : filteredSugestoes.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-sm font-semibold text-gray-900">
                Nenhuma sugestao encontrada.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Ajuste a busca ou os filtros para ver outros resultados.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sugestao
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Categoria
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Autor
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSugestoes.map((sugestao) => (
                    <tr
                      key={sugestao.idSugestao}
                      className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="max-w-[280px] truncate font-semibold text-gray-900">
                          {sugestao.eventName}
                        </p>
                        <p className="mt-1 max-h-10 max-w-[360px] overflow-hidden text-xs leading-5 text-gray-500">
                          {sugestao.description || "Sem descricao informada."}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {getCategoryLabel(sugestao.category)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                            STATUS_STYLES[sugestao.status] ?? STATUS_STYLES.PENDENTE
                          }`}
                        >
                          {getStatusLabel(sugestao.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <span className="inline-flex max-w-[180px] items-center gap-2 truncate">
                          <UserRound size={14} className="shrink-0 text-gray-400" />
                          <span className="truncate">
                            {sugestao.creatorName || "Usuario nao informado"}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingId === sugestao.idSugestao}
                            onClick={() => setSugestaoParaExcluir(sugestao)}
                            className="h-8 gap-1.5 rounded-lg border-red-200 text-xs font-semibold text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                            {deletingId === sugestao.idSugestao
                              ? "Excluindo..."
                              : "Excluir"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ArenaPageLayout>
  );
}
