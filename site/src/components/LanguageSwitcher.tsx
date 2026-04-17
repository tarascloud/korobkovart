"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  es: "ES",
  ua: "UA",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(loc: string) {
    document.cookie = `NEXT_LOCALE=${loc};path=/;max-age=${365 * 24 * 60 * 60}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none ${
            locale === loc
              ? "text-foreground font-bold border-b-2 border-foreground"
              : "text-secondary hover:text-foreground"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
