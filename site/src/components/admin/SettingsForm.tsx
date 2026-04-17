"use client";

import { useState, type FormEvent } from "react";

interface SiteSettings {
  id: string;
  siteName: string;
  phone: string;
  email: string;
  instagram: string;
  tgBotToken: string;
  tgChatId: string;
  tgEnabled: boolean;
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(key: keyof SiteSettings, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      setMessage("Settings saved successfully");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-green-50 text-green-700 text-sm border border-green-200">
          {message}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold tracking-wider uppercase text-secondary mb-2">
          General
        </legend>

        <div>
          <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Site Name
          </label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => update("siteName", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Instagram URL
          </label>
          <input
            type="url"
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 pt-4 border-t border-border">
        <legend className="text-sm font-bold tracking-wider uppercase text-secondary mb-2">
          Telegram Notifications
        </legend>

        <div>
          <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Bot Token
          </label>
          <input
            type="password"
            value={form.tgBotToken}
            onChange={(e) => update("tgBotToken", e.target.value)}
            placeholder="123456:ABC-DEF..."
            className="w-full border border-border px-3 py-2 text-sm bg-transparent font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Chat ID
          </label>
          <input
            type="text"
            value={form.tgChatId}
            onChange={(e) => update("tgChatId", e.target.value)}
            placeholder="-1001234567890"
            className="w-full border border-border px-3 py-2 text-sm bg-transparent font-mono"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.tgEnabled}
            onChange={(e) => update("tgEnabled", e.target.checked)}
            className="w-4 h-4"
          />
          Enable Telegram notifications
        </label>
      </fieldset>

      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-foreground text-background text-sm tracking-wider uppercase disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
