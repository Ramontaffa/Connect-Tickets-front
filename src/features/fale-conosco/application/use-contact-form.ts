import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

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
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success("Mensagem enviada com sucesso!");
      setFormData(initialContactFormData);
      setErrors({});
    } catch {
      toast.error("Não foi possível enviar a mensagem. Tente novamente.");
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
