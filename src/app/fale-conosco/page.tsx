"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquareText } from "lucide-react";

import { useContactForm } from "@/features/fale-conosco/application/use-contact-form";
import { ContactFormCard } from "@/features/fale-conosco/presentation/contact-form-card";
import { ContactInfoCards } from "@/features/fale-conosco/presentation/contact-info-cards";

export default function FaleConoscoPage() {
  const { formData, errors, isSubmitting, handleFieldChange, handleSubmit } =
    useContactForm();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <section className="mb-12">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-200">
              <MessageSquareText className="h-7 w-7 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Fale Conosco</h1>
          </div>

          <p className="max-w-4xl text-base text-slate-600 md:text-lg">
            Entre em contato conosco. Estamos aqui para ajudar e responder suas
            dúvidas.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ContactFormCard
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
          />

          <ContactInfoCards />
        </section>
      </div>
    </main>
  );
}
