"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function InquiryForm({
  artworkTitle,
  type = "general",
}: {
  artworkTitle?: string;
  type?: "general" | "partner" | "artwork";
}) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject") || artworkTitle || "General Inquiry",
      message: form.get("message"),
      type,
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">{t("form_success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="inquiry-name" className="block text-sm text-secondary mb-1">
          {t("form_name")}
        </label>
        <input
          id="inquiry-name"
          name="name"
          required
          className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="inquiry-email" className="block text-sm text-secondary mb-1">
          {t("form_email")}
        </label>
        <input
          id="inquiry-email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors duration-300"
        />
      </div>

      {type === "general" && (
        <div>
          <label htmlFor="inquiry-subject" className="block text-sm text-secondary mb-1">
            {t("form_subject")}
          </label>
          <select
            id="inquiry-subject"
            name="subject"
            className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors duration-300"
          >
            <option value="buy">{t("subject_buy")}</option>
            <option value="commission">{t("subject_commission")}</option>
            <option value="exhibition">{t("subject_exhibition")}</option>
            <option value="other">{t("subject_other")}</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="inquiry-message" className="block text-sm text-secondary mb-1">
          {t("form_message")}
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-transparent border border-border focus:border-foreground outline-none transition-colors duration-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-foreground text-background text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
      >
        {status === "sending" ? "..." : t("form_submit")}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-sm">{t("form_error")}</p>
      )}
    </form>
  );
}
