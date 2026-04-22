import type { ContactFormData, ContactFormErrors } from "./contact-form.types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validateContactForm(values: ContactFormData): ContactFormErrors {
  const nextErrors: ContactFormErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Informe seu nome completo.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Informe seu e-mail.";
  } else if (!emailRegex.test(values.email)) {
    nextErrors.email = "Digite um e-mail válido.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length > 0 && phoneDigits.length < 10) {
    nextErrors.phone = "Digite um telefone válido com DDD.";
  }

  if (!values.subject.trim()) {
    nextErrors.subject = "Informe o assunto.";
  }

  if (!values.message.trim()) {
    nextErrors.message = "Escreva sua mensagem.";
  } else if (values.message.trim().length < 10) {
    nextErrors.message = "A mensagem deve ter pelo menos 10 caracteres.";
  }

  return nextErrors;
}

export function hasRequiredFieldErrors(errors: ContactFormErrors) {
  return Boolean(errors.fullName || errors.email || errors.subject || errors.message);
}
