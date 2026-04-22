import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { ComponentType } from "react";

export type ContactInfoLine = {
  text: string;
  href?: string;
};

export type ContactInfoItem = {
  title: string;
  lines: ContactInfoLine[];
  icon: ComponentType<{ className?: string }>;
};

export const contactInfoItems: ContactInfoItem[] = [
  {
    title: "Telefone",
    lines: [
      { text: "(81) 3000-0000", href: "tel:+558130000000" },
      { text: "(81) 99999-9999", href: "tel:+5581999999999" },
    ],
    icon: Phone,
  },
  {
    title: "E-mail",
    lines: [
      {
        text: "contato@arenapernambuco.com.br",
        href: "mailto:contato@arenapernambuco.com.br",
      },
      {
        text: "eventos@arenapernambuco.com.br",
        href: "mailto:eventos@arenapernambuco.com.br",
      },
    ],
    icon: Mail,
  },
  {
    title: "Endereço",
    lines: [
      {
        text: "Av. Deus é Fiel, 1",
        href: "https://www.google.com/maps/search/?api=1&query=Av.+Deus+%C3%A9+Fiel,+1,+S%C3%A3o+Louren%C3%A7o+da+Mata+-+PE",
      },
      {
        text: "São Lourenço da Mata - PE",
        href: "https://www.google.com/maps/search/?api=1&query=Av.+Deus+%C3%A9+Fiel,+1,+S%C3%A3o+Louren%C3%A7o+da+Mata+-+PE",
      },
      {
        text: "CEP: 54735-000",
        href: "https://www.google.com/maps/search/?api=1&query=Av.+Deus+%C3%A9+Fiel,+1,+S%C3%A3o+Louren%C3%A7o+da+Mata+-+PE",
      },
    ],
    icon: MapPin,
  },
  {
    title: "Horário",
    lines: [{ text: "Segunda a Sexta" }, { text: "09:00 às 18:00" }],
    icon: Clock3,
  },
];
