import { Card, CardContent } from "@/components/ui/card";
import { arenaTheme } from "@/lib/arena-theme";

import { contactInfoItems } from "../domain/contact-info";

export function ContactInfoCards() {
  return (
    <div className="space-y-6">
      {contactInfoItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className={arenaTheme.glassCard + " rounded-3xl py-0 shadow-none"}
          >
            <CardContent className="flex items-start gap-5 p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-arena-border bg-arena-surface-strong">
                <Icon className="h-6 w-6 text-violet-400" />
              </div>

              <div>
                <h3 className="mb-2 text-2xl font-semibold leading-none text-white">
                  {item.title}
                </h3>
                {item.lines.map((line) => {
                  if (!line.href) {
                    return (
                      <p key={line.text} className="text-base text-white/60">
                        {line.text}
                      </p>
                    );
                  }

                  const external = line.href.startsWith("http");

                  return (
                    <a
                      key={line.text}
                      href={line.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="block text-base text-white/60 transition-colors hover:text-white hover:underline"
                    >
                      {line.text}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
