"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  es: "ES",
  ua: "UA",
};

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function switchLocale(loc: string) {
    if (loc === locale) return;

    // Persist locale in cookie (SameSite=Lax, long-lived, available to all paths)
    document.cookie = `NEXT_LOCALE=${loc};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;

    // Use next-intl router.replace so path-aware rewrite happens without full reload
    const qs = searchParams?.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.replace(href, { locale: loc });
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => {
        const isActive = locale === loc;
        return (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            aria-pressed={isActive}
            aria-label={`Switch language to ${labels[loc]}`}
            disabled={isPending && !isActive}
            className={`px-2 py-1 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none ${
              isActive
                ? "text-foreground font-bold border-b-2 border-foreground"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {labels[loc]}
          </button>
        );
      })}
    </div>
  );
}
