import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arena Pernambuco",
  description: "Plataforma de Gestão de Eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-[ui-sans-serif,system-ui,sans-serif]">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
