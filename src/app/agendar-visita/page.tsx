"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Clock, Users, CheckCircle, ArrowLeft, Phone, Mail, MessageCircle, Info } from "lucide-react";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export default function AgendarVisitaPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [visitors, setVisitors] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && visitors) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold">AP</div>
          <span className="font-semibold tracking-tight text-white">Arena Pernambuco</span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: "Início", href: "/home" },
            { label: "Eventos", href: "/eventos" },
            { label: "Sugerir", href: "/sugerir" },
            { label: "Agendar Visita", href: "/agendar-visita", active: true },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                item.active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/" className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
            Sair
          </Link>
        </div>
      </nav>

      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-3xl mx-auto">

          {/* BACK */}
          <Link href="/home" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8">
            <ArrowLeft size={14} />
            Voltar
          </Link>

          {/* HEADER */}
          <div className="flex items-start gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <MapPin size={20} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Agendar Visita</h1>
              <p className="text-white/40 mt-1 leading-relaxed max-w-lg">
                Conheça a estrutura da Arena Pernambuco. Agende uma visita guiada e descubra os bastidores deste espaço.
              </p>
            </div>
          </div>

          {!submitted ? (
            <div className="space-y-5">
              {/* FORM CARD */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-7">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-2">
                      <Calendar size={14} className="text-violet-400" />
                      Data da Visita *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
                    />
                    <p className="text-xs text-white/30 mt-1.5">Visitas disponíveis de segunda a sexta-feira</p>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-2">
                      <Clock size={14} className="text-violet-400" />
                      Horário *
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                            time === slot
                              ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20"
                              : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visitors */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-2">
                      <Users size={14} className="text-violet-400" />
                      Número de Visitantes *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      placeholder="Ex: 5"
                      value={visitors}
                      onChange={(e) => setVisitors(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all"
                    />
                    <p className="text-xs text-white/30 mt-1.5">Grupos de até 50 pessoas</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
                    >
                      <CheckCircle size={16} />
                      Confirmar Agendamento
                    </button>
                    <Link
                      href="/home"
                      className="flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 font-semibold text-sm hover:bg-white/8 hover:text-white transition-all"
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
              </div>

              {/* INFO CARD */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={15} className="text-violet-400" />
                  <h3 className="text-sm font-semibold text-white/80">Informações sobre a visita</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "Duração aproximada: 90 minutos",
                    "Tour guiado por todas as áreas principais da arena",
                    "Acesso aos vestiários, área VIP e campo",
                    "Gratuito para grupos escolares e instituições",
                    "Traga documento de identificação",
                  ].map((info) => (
                    <div key={info} className="flex items-start gap-2.5 text-sm text-white/50">
                      <span className="w-1 h-1 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                      {info}
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT CARD */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6">
                <h3 className="text-sm font-semibold text-white/80 mb-4">Dúvidas sobre a visita?</h3>
                <p className="text-sm text-white/40 mb-4">Entre em contato conosco:</p>
                <div className="space-y-3">
                  <a href="tel:81300000000" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                      <Phone size={13} className="text-violet-400" />
                    </div>
                    (81) 3000-0000
                  </a>
                  <a href="mailto:visitas@arenapernambuco.com.br" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                      <Mail size={13} className="text-violet-400" />
                    </div>
                    visitas@arenapernambuco.com.br
                  </a>
                  <a href="https://wa.me/5581999999999" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                      <MessageCircle size={13} className="text-violet-400" />
                    </div>
                    WhatsApp: (81) 99999-9999
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="rounded-2xl bg-white/[0.03] border border-emerald-500/30 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black mb-3">Visita Agendada!</h2>
              <p className="text-white/50 text-sm mb-2">Sua visita foi confirmada para:</p>
              <div className="flex items-center justify-center gap-6 mt-4 mb-8">
                <div className="text-center">
                  <p className="text-xs text-white/30 mb-1">Data</p>
                  <p className="font-bold text-white">{date}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-xs text-white/30 mb-1">Horário</p>
                  <p className="font-bold text-white">{time}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-xs text-white/30 mb-1">Visitantes</p>
                  <p className="font-bold text-white">{visitors} pessoa{parseInt(visitors) !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="text-white/30 text-xs mb-8">Você receberá um email de confirmação em breve.</p>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Voltar ao Início
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
