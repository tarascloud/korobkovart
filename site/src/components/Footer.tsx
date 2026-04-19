import { useTranslations } from "next-intl";

// Inline brand SVG icons (Simple Icons, CC0).
// Using inline SVG avoids adding a new runtime dependency for 3 icons.

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.265.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.849c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.141 0-3.487.012-4.718.068-.975.045-1.504.207-1.856.344-.466.181-.8.397-1.15.748-.35.35-.566.684-.747 1.15-.137.352-.3.881-.344 1.856-.057 1.231-.068 1.577-.068 4.718 0 3.141.011 3.487.068 4.718.045.975.207 1.504.344 1.856.181.466.397.8.748 1.15.35.35.684.566 1.15.748.352.137.881.3 1.856.344 1.231.056 1.577.068 4.718.068 3.141 0 3.487-.012 4.718-.068.975-.045 1.504-.207 1.856-.344.466-.181.8-.397 1.15-.748.35-.35.566-.684.748-1.15.137-.352.3-.881.344-1.856.056-1.231.068-1.577.068-4.718 0-3.141-.012-3.487-.068-4.718-.045-.975-.207-1.504-.344-1.856-.181-.466-.397-.8-.748-1.15-.35-.35-.684-.566-1.15-.748-.352-.137-.881-.3-1.856-.344-1.231-.056-1.577-.068-4.718-.068zm0 3.292a4.707 4.707 0 1 0 0 9.414 4.707 4.707 0 0 0 0-9.414zm0 7.76a3.053 3.053 0 1 1 0-6.106 3.053 3.053 0 0 1 0 6.106zm5.992-7.954a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
    </svg>
  );
}

function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function WhatsappIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const socialLinkCls =
    "inline-flex items-center justify-center w-11 h-11 text-secondary hover:text-foreground transition-colors duration-300";

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top row: brand icons + location (single row even on 375px) */}
        <div className="flex flex-row items-center justify-between gap-3 text-sm text-secondary mb-6 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="https://www.instagram.com/korobkov.art/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={socialLinkCls}
            >
              <InstagramIcon />
            </a>
            <a
              href="https://t.me/Korobkov_art"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className={socialLinkCls}
            >
              <TelegramIcon />
            </a>
            <a
              href="https://wa.me/34652285139"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={socialLinkCls}
            >
              <WhatsappIcon />
            </a>
            <span aria-hidden="true" className="text-secondary/50 mx-1 sm:mx-2">
              ·
            </span>
            <span className="text-[10px] sm:text-xs tracking-wider uppercase">
              Valencia, Spain
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-border mb-6" />

        {/* Bottom row: copyright + legal (external to vs.taras.cloud) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-secondary">
          <span>
            &copy; {year} Korobkov Art Studio. {t("rights")}.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://vs.taras.cloud/privacy"
              target="_blank"
              rel="noopener"
              className="hover:text-foreground transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="https://vs.taras.cloud/terms"
              target="_blank"
              rel="noopener"
              className="hover:text-foreground transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
