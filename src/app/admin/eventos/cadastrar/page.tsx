"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, PlusCircle, Save } from "lucide-react";

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
import { createEvento, type EventoCategory } from "@/lib/api";

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

export default function CadastrarEventoPage() {
  const router = useRouter();
  const { data: session } = useSession();

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
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFields((prev) => ({ ...prev, [name]: newValue }));
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
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(fields.date + "T00:00:00");
      if (selected <= today) {
        newErrors.date = "A data do evento deve ser futura.";
      }
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
      setApiError("Você precisa estar autenticado para cadastrar eventos.");
      return;
    }

    const scheduledAt = `${fields.date}T${fields.time}:00`;
    const scheduledDate = new Date(scheduledAt);
    const dayOfWeek = scheduledDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    setSubmitting(true);
    try {
      await createEvento(
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
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar evento.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/admin/dashboard");
  }

  return (
    <ArenaPageLayout
      active="home"
      contentClassName="pt-28 pb-24 px-8 bg-gray-50 min-h-screen"
      containerClassName="mx-auto w-full max-w-2xl"
    >
      {/* BACK LINK */}
      <Link
        href="/admin/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar ao Dashboard
      </Link>

      {/* PAGE HEADER */}
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <PlusCircle size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Cadastrar Evento
          </h1>
          <p className="mt-1 text-sm text-blue-600">
            Preencha as informações abaixo para adicionar um novo evento à programação.
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
              {submitting ? "Salvando..." : "Salvar Evento"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-[40] rounded-xl border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* INFO CARD */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Informações importantes
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            &bull; Os campos marcados com <span className="font-semibold text-red-500">*</span> são{" "}
            <span className="font-semibold text-blue-600">obrigatórios</span>
          </li>
          <li>
            &bull; A data do evento deve ser{" "}
            <span className="font-semibold text-blue-600">futura</span>
          </li>
          <li>
            &bull; A capacidade máxima da arena é de{" "}
            <span className="font-semibold text-blue-600">45.000 pessoas</span>
          </li>
          <li>
            &bull; Após salvar, o evento estará{" "}
            <span className="font-semibold text-blue-600">disponível publicamente</span>
          </li>
          <li>
            &bull; Você poderá editar ou remover o evento posteriormente
          </li>
        </ul>
      </div>
    </ArenaPageLayout>
  );
}
