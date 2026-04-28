"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Pencil, Save } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEvento, updateEvento, type EventoCategory } from "@/lib/api";

interface FormFields {
  name: string;
  date: string;
  time: string;
  category: string;
  description: string;
  capacity: string;
  expectedAttendance: string;
  isFree: boolean;
  price: string;
  locationDetail: string;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  date?: string;
  time?: string;
  category?: string;
  description?: string;
  capacity?: string;
  expectedAttendance?: string;
  price?: string;
}

const CATEGORIES = [
  { label: "Esporte", value: "ESPORTE" },
  { label: "Cultural", value: "CULTURAL" },
  { label: "Show", value: "SHOW" },
  { label: "Corporativo", value: "CORPORATIVO" },
] as const;

function parseDateFromISO(iso: string): string {
  // retorna "YYYY-MM-DD"
  return iso.slice(0, 10);
}

function parseTimeFromISO(iso: string): string {
  // retorna "HH:MM"
  return iso.slice(11, 16);
}

export default function EditarEventoPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const eventoId = Number(params.id);

  const [fields, setFields] = useState<FormFields>({
    name: "",
    date: "",
    time: "",
    category: "",
    description: "",
    capacity: "",
    expectedAttendance: "",
    isFree: false,
    price: "",
    locationDetail: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventoId || isNaN(eventoId)) {
      setLoadError("ID de evento inválido.");
      setLoading(false);
      return;
    }

    getEvento(eventoId)
      .then((evento) => {
        setFields({
          name: evento.eventName,
          date: parseDateFromISO(evento.scheduledAt),
          time: parseTimeFromISO(evento.scheduledAt),
          category: evento.category,
          description: evento.description ?? "",
          capacity: String(evento.capacity),
          expectedAttendance: String(evento.expectedAttendance),
          isFree: evento.isFree ?? false,
          price: evento.price != null ? String(evento.price) : "",
          locationDetail: evento.locationDetail ?? "",
          imageUrl: evento.imageUrl ?? "",
        });
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Erro ao carregar evento.";
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, [eventoId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleCategoryChange(value: string) {
    setFields((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  }

  function handleIsFreeChange(value: string) {
    const isFree = value === "true";
    setFields((prev) => ({ ...prev, isFree, price: isFree ? "" : prev.price }));
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!fields.name.trim()) {
      newErrors.name = "O nome do evento é obrigatório.";
    } else if (fields.name.trim().length < 5) {
      newErrors.name = "O nome deve ter ao menos 5 caracteres.";
    }

    if (!fields.date) {
      newErrors.date = "A data do evento é obrigatória.";
    }

    if (!fields.time) {
      newErrors.time = "O horário do evento é obrigatório.";
    }

    if (!fields.category) {
      newErrors.category = "Selecione uma categoria.";
    }

    if (!fields.description.trim()) {
      newErrors.description = "A descrição do evento é obrigatória.";
    }

    if (!fields.capacity) {
      newErrors.capacity = "A capacidade máxima é obrigatória.";
    } else {
      const cap = parseInt(fields.capacity, 10);
      if (isNaN(cap) || cap <= 0) {
        newErrors.capacity = "Informe uma capacidade válida.";
      } else if (cap > 45000) {
        newErrors.capacity = "A capacidade máxima da arena é 45.000 pessoas.";
      }
    }

    if (!fields.expectedAttendance) {
      newErrors.expectedAttendance = "A expectativa de público é obrigatória.";
    } else {
      const att = parseInt(fields.expectedAttendance, 10);
      if (isNaN(att) || att <= 0) {
        newErrors.expectedAttendance = "Informe uma expectativa válida.";
      }
    }

    if (!fields.isFree && fields.price !== "") {
      const pr = parseFloat(fields.price);
      if (isNaN(pr) || pr < 0) {
        newErrors.price = "Informe um preço válido.";
      }
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = session?.accessToken;
    if (!token) {
      setApiError("Você precisa estar autenticado para editar eventos.");
      return;
    }

    const scheduledAt = `${fields.date}T${fields.time}:00`;
    const scheduledDate = new Date(scheduledAt);
    const dayOfWeek = scheduledDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    setSubmitting(true);
    try {
      await updateEvento(
        eventoId,
        {
          eventName: fields.name.trim(),
          description: fields.description.trim() || undefined,
          capacity: parseInt(fields.capacity, 10),
          expectedAttendance: parseInt(fields.expectedAttendance, 10),
          category: fields.category as EventoCategory,
          scheduledAt,
          isFree: fields.isFree,
          price: fields.isFree ? 0 : fields.price ? parseFloat(fields.price) : undefined,
          locationDetail: fields.locationDetail.trim() || undefined,
          imageUrl: fields.imageUrl.trim() || undefined,
          isWeekend,
        },
        token
      );
      router.push("/admin/eventos");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar evento.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <ArenaPageLayout
        active="home"
        contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
        containerClassName="mx-auto w-full max-w-2xl"
      >
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-12 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      </ArenaPageLayout>
    );
  }

  if (loadError) {
    return (
      <ArenaPageLayout
        active="home"
        contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
        containerClassName="mx-auto w-full max-w-2xl"
      >
        <Link
          href="/admin/eventos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Voltar à lista de eventos
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">Evento não encontrado</p>
          <p className="mt-1 text-xs text-red-600">{loadError}</p>
        </div>
      </ArenaPageLayout>
    );
  }

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
      containerClassName="mx-auto w-full max-w-2xl"
    >
      {/* BACK LINK */}
      <Link
        href="/admin/eventos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar à lista de eventos
      </Link>

      {/* PAGE HEADER */}
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <Pencil size={20} className="text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Editar Evento
          </h1>
          <p className="mt-1 text-sm text-amber-600">
            Atualize as informações do evento abaixo.
          </p>
        </div>
      </div>

      {/* API ERROR */}
      {apiError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* FORM CARD */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Nome do Evento */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Nome do Evento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Copa do Nordeste 2026"
              value={fields.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-gray-900">
                Data <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={fields.date}
                onChange={handleChange}
                aria-invalid={!!errors.date}
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 focus-visible:ring-blue-500/30"
              />
              {errors.date && (
                <p className="text-xs text-red-600">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold text-gray-900">
                Horário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={fields.time}
                onChange={handleChange}
                aria-invalid={!!errors.time}
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 focus-visible:ring-blue-500/30"
              />
              {errors.time && (
                <p className="text-xs text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <Select value={fields.category} onValueChange={handleCategoryChange}>
              <SelectTrigger
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 data-placeholder:text-gray-400"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva os detalhes do evento..."
              value={fields.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
              className="min-h-24 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Capacidade e Expectativa de Público */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm font-semibold text-gray-900">
                Capacidade Máxima <span className="text-red-500">*</span>
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                max={45000}
                placeholder="Ex: 45000"
                value={fields.capacity}
                onChange={handleChange}
                aria-invalid={!!errors.capacity}
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
              />
              <p className="text-xs text-gray-500">Máx: 45.000 pessoas</p>
              {errors.capacity && (
                <p className="text-xs text-red-600">{errors.capacity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedAttendance" className="text-sm font-semibold text-gray-900">
                Expectativa de Público <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expectedAttendance"
                name="expectedAttendance"
                type="number"
                min={1}
                placeholder="Ex: 30000"
                value={fields.expectedAttendance}
                onChange={handleChange}
                aria-invalid={!!errors.expectedAttendance}
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
              />
              {errors.expectedAttendance && (
                <p className="text-xs text-red-600">{errors.expectedAttendance}</p>
              )}
            </div>
          </div>

          {/* É gratuito? */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              Ingresso
            </Label>
            <Select
              value={fields.isFree ? "true" : "false"}
              onValueChange={handleIsFreeChange}
            >
              <SelectTrigger className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Gratuito</SelectItem>
                <SelectItem value="false">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preço — exibido apenas quando não é gratuito */}
          {!fields.isFree && (
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold text-gray-900">
                Preço (R$)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={0.01}
                placeholder="Ex: 120.00"
                value={fields.price}
                onChange={handleChange}
                aria-invalid={!!errors.price}
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price}</p>
              )}
            </div>
          )}

          {/* Local */}
          <div className="space-y-2">
            <Label htmlFor="locationDetail" className="text-sm font-semibold text-gray-900">
              Local
            </Label>
            <Input
              id="locationDetail"
              name="locationDetail"
              type="text"
              placeholder="Ex: Arena Pernambuco, Camarote Sul"
              value={fields.locationDetail}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
            />
          </div>

          {/* URL da Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-900">
              URL da Imagem
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="text"
              placeholder="https://exemplo.com/imagem.jpg"
              value={fields.imageUrl}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/30"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="flex flex-[40] items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              <Save size={15} />
              {submitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/eventos")}
              className="flex-[40] rounded-xl border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </ArenaPageLayout>
  );
}
