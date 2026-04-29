import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { createSugestao, type EventoCategory, type SugestaoDTO } from "@/lib/api";
import { getToken } from "@/lib/auth-session";
import {
  formatPhone,
  hasRequiredFieldErrors,
  validateContactForm,
} from "../domain/contact-form.validation";
import {
  initialContactFormData,
  type ContactFormData,
  type ContactFormErrors,
} from "../domain/contact-form.types";

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialContactFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field: keyof ContactFormData, value: string) {
    const nextValue = field === "phone" ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (hasRequiredFieldErrors(validationErrors)) {
        toast.error("Preencha os campos obrigatórios para enviar a mensagem.");
      } else {
        toast.error("Revise os campos preenchidos e tente novamente.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      
      const sugestaoData: SugestaoDTO = {
        eventName: formData.subject,
        description: formData.message,
        category: "CORPORATIVO" as EventoCategory,
      };

      await createSugestao(sugestaoData, token ?? undefined);
      
      toast.success("Mensagem enviada com sucesso!");
      setFormData(initialContactFormData);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Não foi possível enviar a mensagem. ${message}`);
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
  };
}
