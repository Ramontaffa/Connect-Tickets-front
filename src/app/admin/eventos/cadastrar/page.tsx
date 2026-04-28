"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

interface FormFields {
  name: string;
  date: string;
  time: string;
  category: string;
  description: string;
  capacity: string;
}

interface FormErrors {
  name?: string;
  date?: string;
  time?: string;
  category?: string;
  description?: string;
  capacity?: string;
}

const CATEGORIES = ["Esporte", "Cultural", "Show", "Corporativo"] as const;

export default function CadastrarEventoPage() {
  const router = useRouter();

  const [fields, setFields] = useState<FormFields>({
    name: "",
    date: "",
    time: "",
    category: "",
    description: "",
    capacity: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!fields.name.trim()) {
      newErrors.name = "O nome do evento é obrigatório.";
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

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const stored = localStorage.getItem("admin_events");
    const existing: FormFields[] = stored ? (JSON.parse(stored) as FormFields[]) : [];
    existing.push(fields);
    localStorage.setItem("admin_events", JSON.stringify(existing));

    router.push("/admin/dashboard");
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
            <Select
              value={fields.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className="h-10 w-full rounded-lg border-gray-300 bg-white text-gray-900 data-placeholder:text-gray-400"
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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

          {/* Capacidade Máxima */}
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
            <p className="text-xs text-gray-500">
              Capacidade máxima da arena: 45.000 pessoas
            </p>
            {errors.capacity && (
              <p className="text-xs text-red-600">{errors.capacity}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              className="flex flex-[40] items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <Save size={15} />
              Salvar Evento
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
            &bull; Todos os campos são{" "}
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
