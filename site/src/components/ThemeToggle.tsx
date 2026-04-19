"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`min-w-[44px] min-h-[44px] ${className}`} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";
  const nextLabel = isDark ? t("theme_light") : t("theme_dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${className}`}
      aria-label={nextLabel}
      title={nextLabel}
    >
      {isDark ? (
        <Sun size={20} strokeWidth={1.8} />
      ) : (
        <Moon size={20} strokeWidth={1.8} />
      )}
    </button>
  );
}
