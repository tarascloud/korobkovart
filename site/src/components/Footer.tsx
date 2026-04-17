import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
          <div className="flex items-center gap-2">
            <span>&copy; {year} Korobkov Art Studio.</span>
            <span>{t("rights")}.</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/korobkov.art/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="https://t.me/Korobkov_art"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300"
            >
              Telegram
            </a>
            <a
              href="https://wa.me/34658573627"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300"
            >
              WhatsApp
            </a>
            <span>Valencia, Spain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
