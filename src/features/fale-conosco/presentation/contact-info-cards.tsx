import { Card, CardContent } from "@/components/ui/card";

import { contactInfoItems } from "../domain/contact-info";

export function ContactInfoCards() {
  return (
    <div className="space-y-6">
      {contactInfoItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-gray-100 py-0 shadow-none"
          >
            <CardContent className="flex items-start gap-5 p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                <Icon className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="mb-2 text-2xl font-semibold leading-none text-slate-900">
                  {item.title}
                </h3>
                {item.lines.map((line) => {
                  if (!line.href) {
                    return (
                      <p key={line.text} className="text-base text-slate-600">
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
                      className="block text-base text-slate-600 transition-colors hover:text-slate-900 hover:underline"
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
