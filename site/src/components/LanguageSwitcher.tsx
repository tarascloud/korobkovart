"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  es: "ES",
  ua: "UA",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`px-2 py-1 transition-colors ${
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
