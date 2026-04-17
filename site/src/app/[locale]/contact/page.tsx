import { useTranslations } from "next-intl";
import { InquiryForm } from "@/components/InquiryForm";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-4">
        {t("title")}
      </h1>
      <p className="text-xl text-secondary mb-12">{t("subtitle")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <InquiryForm type="general" />
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm text-secondary tracking-wider uppercase mb-2">
              {t("phone")}
            </h3>
            <a
              href="tel:+380634755619"
              className="text-lg hover:text-secondary transition-colors"
            >
              +38 (063) 475 56 19
            </a>
          </div>

          <div>
            <h3 className="text-sm text-secondary tracking-wider uppercase mb-2">
              Email
            </h3>
            <a
              href="mailto:info@korobkovart.com"
              className="text-lg hover:text-secondary transition-colors"
            >
              info@korobkovart.com
            </a>
          </div>

          <div>
            <h3 className="text-sm text-secondary tracking-wider uppercase mb-2">
              {t("location")}
            </h3>
            <p className="text-lg">Kyiv, Ukraine</p>
          </div>

          <div>
            <h3 className="text-sm text-secondary tracking-wider uppercase mb-2">
              {t("follow")}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/korobkov.art/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-secondary transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
