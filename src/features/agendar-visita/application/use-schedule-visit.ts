import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { createVisita, type VisitaDTO } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth-session";

export type ScheduleVisitFormData = {
  date: string;
  time: string;
  visitors: string;
};

export type ScheduleVisitFormErrors = Partial<Record<keyof ScheduleVisitFormData, string>>;

const initialFormData: ScheduleVisitFormData = {
  date: "",
  time: "",
  visitors: "",
};

export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekday(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function combineDateAndTime(date: string, time: string): string {
  // Combine date (yyyy-MM-dd) and time (HH:mm) into ISO 8601 format
  return `${date}T${time}:00`;
}

export function useScheduleVisit() {
  const [formData, setFormData] = useState<ScheduleVisitFormData>(initialFormData);
  const [errors, setErrors] = useState<ScheduleVisitFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field: keyof ScheduleVisitFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validateForm(values: ScheduleVisitFormData): ScheduleVisitFormErrors {
    const nextErrors: ScheduleVisitFormErrors = {};
    const today = getTodayDateString();

    if (!values.date) {
      nextErrors.date = "Selecione uma data para a visita.";
    } else if (values.date < today) {
      nextErrors.date = "Escolha uma data de hoje em diante.";
    } else if (!isWeekday(values.date)) {
      nextErrors.date = "Selecione uma data entre segunda e sexta-feira.";
    }

    if (!values.time) {
      nextErrors.time = "Selecione um horário disponível.";
    }

    if (!values.visitors.trim()) {
      nextErrors.visitors = "Informe o número de visitantes.";
    } else {
      const totalVisitors = Number(values.visitors);
      if (!Number.isInteger(totalVisitors) || totalVisitors < 1 || totalVisitors > 50) {
        nextErrors.visitors = "Informe um número entre 1 e 50 visitantes.";
      }
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<boolean> {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Preencha os campos obrigatórios e revise os valores informados.");
      return false;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Você precisa estar autenticado para agendar uma visita.");
        setIsSubmitting(false);
        return false;
      }

      const user = getUser();
      if (!user?.id) {
        toast.error("Erro ao recuperar dados do usuário. Faça login novamente.");
        setIsSubmitting(false);
        return false;
      }

      const scheduledAt = combineDateAndTime(formData.date, formData.time);

      const visitaData: VisitaDTO = {
        scheduledAt,
        requesterId: user.id,
        authorizerId: null,
      };

      await createVisita(visitaData, token);

      toast.success("Visita agendada com sucesso!");
      setFormData(initialFormData);
      setErrors({});
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Não foi possível agendar a visita. ${message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
    resetForm: () => setFormData(initialFormData),
  };
}
