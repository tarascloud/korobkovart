import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
        <div className="flex items-center gap-2">
          <span>&copy; {year} Korobkov Art Studio.</span>
          <span>{t("rights")}.</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/korobkov.art/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <a
            href="tel:+380634755619"
            className="hover:text-foreground transition-colors"
          >
            +38 (063) 475 56 19
          </a>
        </div>
      </div>
    </footer>
  );
}
