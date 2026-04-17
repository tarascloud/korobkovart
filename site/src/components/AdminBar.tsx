"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const DISMISS_KEY = "admin-bar-dismissed";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/orders", label: "Orders" },
] as const;

export function AdminBar({
  user,
}: {
  user?: { role?: string } | null;
}) {
  const [dismissed, setDismissed] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const stored = sessionStorage.getItem(DISMISS_KEY);
    setDismissed(stored === "1");
  }, []);

  if (!user || user.role !== "OWNER" || dismissed) {
    return null;
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-9 bg-[#1a1a1a]/90 backdrop-blur-sm text-white flex items-center justify-between px-4 text-xs">
      <div className="flex items-center gap-4">
        <span className="text-white/50 uppercase tracking-wider text-[10px]">Admin</span>
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-white/80 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleDismiss}
        className="text-white/50 hover:text-white transition-colors w-6 h-6 flex items-center justify-center"
        aria-label="Dismiss admin bar"
      >
        &times;
      </button>
    </div>
  );
}
