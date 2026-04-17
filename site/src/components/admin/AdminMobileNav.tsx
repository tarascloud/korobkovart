"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";

const adminLinks = [
  { href: "/admin" as const, key: "dashboard" },
  { href: "/admin/artworks" as const, key: "artworks" },
  { href: "/admin/collections" as const, key: "collections" },
  { href: "/admin/orders" as const, key: "orders" },
  { href: "/admin/marketing" as const, key: "marketing" },
  { href: "/admin/settings" as const, key: "settings" },
  { href: "/admin/tasks" as const, key: "tasks" },
] as const;

export function AdminMobileNav() {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-muted rounded transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
        aria-label="Open admin menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Slide-out panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wider uppercase text-secondary">
                {t("title")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
                aria-label="Close admin menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-2 text-sm">
              {adminLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-foreground text-secondary transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
