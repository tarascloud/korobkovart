"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/gallery", key: "gallery" },
  { href: "/about", key: "about" },
  { href: "/cv", key: "cv" },
  { href: "/partners", key: "partners" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ user }: { user?: { name?: string | null; email?: string | null; image?: string | null; role?: string } | null }) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo size={40} showText={true} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors duration-300 relative group"
            >
              {t(link.key)}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full" />
            </Link>
          ))}
          {user?.role === "OWNER" && (
            <Link
              href="/admin"
              className="text-sm tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors duration-300 relative group flex items-center gap-1"
            >
              <Lock size={12} />
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all group-hover:w-full" />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <UserMenu user={user || null} />

          {/* Mobile burger */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-[2px] bg-foreground origin-center"
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-[2px] bg-foreground origin-center"
              animate={
                menuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl tracking-[0.15em] uppercase text-foreground hover:text-secondary transition-colors duration-300"
                >
                  {t(link.key)}
                </Link>
              ))}

              {user?.role === "OWNER" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl tracking-wider uppercase text-foreground hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <Lock size={20} />
                  Admin
                </Link>
              )}

              {/* Language & Theme controls */}
              <div className="border-t border-border pt-4 flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
