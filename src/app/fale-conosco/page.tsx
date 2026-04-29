"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquareText } from "lucide-react";

import { ArenaPageLayout } from "@/components/arena/arena-page-layout";
import { useAuth } from "@/lib/use-auth";
import { useContactForm } from "@/features/fale-conosco/application/use-contact-form";
import { ContactFormCard } from "@/features/fale-conosco/presentation/contact-form-card";
import { ContactInfoCards } from "@/features/fale-conosco/presentation/contact-info-cards";
import { arenaTheme } from "@/lib/arena-theme";

export default function FaleConoscoPage() {
  const { formData, errors, isSubmitting, handleFieldChange, handleSubmit } =
    useContactForm();

  // Hook para verificação manual de autenticação
  const { isAuthenticated, isLoading, redirectToLogin } = useAuth();

  async function handleSubmitWithAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Verifica autenticação antes de enviar
    if (!isAuthenticated) {
      redirectToLogin("/fale-conosco");
      return;
    }

    await handleSubmit(e);
  }

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <ArenaPageLayout
        active="fale-conosco"
        containerClassName="max-w-7xl"
        isAuthenticated={isAuthenticated}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-pulse">
            <p className="text-white/50">Carregando...</p>
          </div>
        </div>
      </ArenaPageLayout>
    );
  }

  return (
    <ArenaPageLayout
      active="fale-conosco"
      containerClassName="max-w-7xl"
      isAuthenticated={isAuthenticated}
      topDecoration={
        <>
          <div className="pointer-events-none fixed top-8 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="pointer-events-none fixed right-12 top-24 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />
        </>
      }
    >
        <Link
          href="/home"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <section className="mb-12">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-arena-border bg-arena-surface-strong">
              <MessageSquareText className="h-7 w-7 text-violet-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Fale Conosco</h1>
          </div>

          <p className={arenaTheme.mutedText + " max-w-4xl text-base md:text-lg"}>
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
            onSubmit={handleSubmitWithAuth}
          />

          <ContactInfoCards />
        </section>
    </ArenaPageLayout>
  );
}
