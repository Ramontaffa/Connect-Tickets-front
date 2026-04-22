import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ContactFormData, ContactFormErrors } from "../domain/contact-form.types";

type ContactFormCardProps = {
  formData: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  onFieldChange: (field: keyof ContactFormData, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ContactFormCard({
  formData,
  errors,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: ContactFormCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-gray-100 py-0 shadow-none">
      <CardContent className="p-6 md:p-8">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">Envie sua Mensagem</h2>

        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                Nome Completo *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Seu nome"
                value={formData.fullName}
                onChange={(event) => onFieldChange("fullName", event.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                className="mt-1.5 h-11 border-0 bg-gray-200"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                E-mail *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(event) => onFieldChange("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                className="mt-1.5 h-11 border-0 bg-gray-200"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                maxLength={15}
                value={formData.phone}
                onChange={(event) => onFieldChange("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)}
                className="mt-1.5 h-11 border-0 bg-gray-200"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
                Assunto *
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Qual o motivo do contato?"
                value={formData.subject}
                onChange={(event) => onFieldChange("subject", event.target.value)}
                aria-invalid={Boolean(errors.subject)}
                className="mt-1.5 h-11 border-0 bg-gray-200"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium text-slate-700">
              Mensagem *
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Digite sua mensagem aqui..."
              value={formData.message}
              onChange={(event) => onFieldChange("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              className="mt-1.5 min-h-56 resize-none border-0 bg-gray-200"
            />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-14 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <Send className="h-5 w-5" />
            {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
