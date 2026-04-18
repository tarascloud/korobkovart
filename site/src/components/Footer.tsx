import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top row: social links + location */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-secondary mb-6">
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/korobkov.art/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Instagram
            </a>
            <a
              href="https://t.me/Korobkov_art"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Telegram
            </a>
            <a
              href="https://wa.me/34652285139"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              WhatsApp
            </a>
          </div>
          <span className="text-xs tracking-wider uppercase">Valencia, Spain</span>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-border mb-6" />

        {/* Bottom row: copyright + legal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-secondary">
          <span>&copy; {year} Korobkov Art Studio. {t("rights")}.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
