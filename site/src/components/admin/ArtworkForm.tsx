"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const SERIES_OPTIONS = ["podilia", "destruction", "murals", "graphics", "earlier"];
const STATUS_OPTIONS = ["available", "sold", "on_exhibition", "exists"];

interface ArtworkFormData {
  id?: string;
  title: string;
  slug: string;
  year: number;
  series: string;
  medium: string;
  dimensions: string;
  status: string;
  imagePath: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionUa: string;
  collaborator: string;
  featured: boolean;
  sortOrder: number;
  price: number | null;
  limitedEditionTotal: number | null;
  limitedEditionAvailable: number | null;
}

const emptyForm: ArtworkFormData = {
  title: "",
  slug: "",
  year: new Date().getFullYear(),
  series: "podilia",
  medium: "",
  dimensions: "",
  status: "available",
  imagePath: "",
  descriptionEn: "",
  descriptionEs: "",
  descriptionUa: "",
  collaborator: "",
  featured: false,
  sortOrder: 0,
  price: null,
  limitedEditionTotal: null,
  limitedEditionAvailable: null,
};

export function ArtworkForm({
  artwork,
  locale,
}: {
  artwork?: ArtworkFormData;
  locale: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArtworkFormData>(artwork || emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!artwork?.id;

  function update(key: keyof ArtworkFormData, value: string | number | boolean | null) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEdit
        ? `/api/admin/artworks/${artwork.id}`
        : "/api/admin/artworks";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push(`/${locale}/admin/artworks`);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div id="artwork-form-error" role="alert" className="p-3 bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="artwork-title" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Title *
          </label>
          <input
            id="artwork-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => {
              update("title", e.target.value);
              if (!isEdit) update("slug", generateSlug(e.target.value));
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "artwork-form-error" : undefined}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="artwork-slug" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Slug *
          </label>
          <input
            id="artwork-slug"
            type="text"
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="artwork-year" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Year *
          </label>
          <input
            id="artwork-year"
            type="number"
            required
            value={form.year}
            onChange={(e) => update("year", Number(e.target.value))}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="artwork-series" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Series *
          </label>
          <select
            id="artwork-series"
            value={form.series}
            onChange={(e) => update("series", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          >
            {SERIES_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="artwork-status" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Status
          </label>
          <select
            id="artwork-status"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="artwork-medium" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Medium *
          </label>
          <input
            id="artwork-medium"
            type="text"
            required
            value={form.medium}
            onChange={(e) => update("medium", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="artwork-dimensions" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Dimensions *
          </label>
          <input
            id="artwork-dimensions"
            type="text"
            required
            value={form.dimensions}
            onChange={(e) => update("dimensions", e.target.value)}
            placeholder="e.g. 160x120 cm"
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="artwork-image-path" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Image Path *
        </label>
        <input
          id="artwork-image-path"
          type="text"
          required
          value={form.imagePath}
          onChange={(e) => update("imagePath", e.target.value)}
          placeholder="/artworks/my-artwork.jpg"
          className="w-full border border-border px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div>
        <label htmlFor="artwork-image-upload" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Upload Image
        </label>
        <input
          id="artwork-image-upload"
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError("");
            try {
              const fd = new FormData();
              fd.append("file", file);
              fd.append("slug", form.slug || "artwork");
              const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: fd,
              });
              const data = await res.json();
              if (data.path) {
                setForm((prev) => ({ ...prev, imagePath: data.path }));
              } else {
                setError(data.error || "Upload failed");
              }
            } catch {
              setError("Upload failed");
            } finally {
              setUploading(false);
            }
          }}
          className="w-full border border-border px-3 py-2 text-sm bg-transparent file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-foreground file:text-background file:text-xs file:uppercase file:tracking-wider file:cursor-pointer"
        />
        {uploading && (
          <p className="mt-1 text-xs text-secondary">Uploading...</p>
        )}
        {form.imagePath && (
          <img
            src={form.imagePath}
            alt="Preview"
            className="mt-2 h-32 object-contain border border-border"
          />
        )}
      </div>

      <div>
        <label htmlFor="artwork-collaborator" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Collaborator
        </label>
        <input
          id="artwork-collaborator"
          type="text"
          value={form.collaborator}
          onChange={(e) => update("collaborator", e.target.value)}
          className="w-full border border-border px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="artwork-sort-order" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Sort Order
          </label>
          <input
            id="artwork-sort-order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value))}
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="artwork-price" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Price (cents EUR)
          </label>
          <input
            id="artwork-price"
            type="number"
            value={form.price ?? ""}
            onChange={(e) =>
              update("price", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="Leave empty for &laquo;on request&raquo;"
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div className="flex items-end pb-2">
          <label htmlFor="artwork-featured" className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              id="artwork-featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="w-4 h-4"
            />
            Featured
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="artwork-le-total" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Limited Edition Total
          </label>
          <input
            id="artwork-le-total"
            type="number"
            value={form.limitedEditionTotal ?? ""}
            onChange={(e) =>
              update("limitedEditionTotal", e.target.value ? Number(e.target.value) : null)
            }
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="artwork-le-available" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
            Limited Edition Available
          </label>
          <input
            id="artwork-le-available"
            type="number"
            value={form.limitedEditionAvailable ?? ""}
            onChange={(e) =>
              update(
                "limitedEditionAvailable",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="w-full border border-border px-3 py-2 text-sm bg-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="artwork-desc-en" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Description (EN)
        </label>
        <textarea
          id="artwork-desc-en"
          rows={3}
          value={form.descriptionEn}
          onChange={(e) => update("descriptionEn", e.target.value)}
          className="w-full border border-border px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div>
        <label htmlFor="artwork-desc-es" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Description (ES)
        </label>
        <textarea
          id="artwork-desc-es"
          rows={3}
          value={form.descriptionEs}
          onChange={(e) => update("descriptionEs", e.target.value)}
          className="w-full border border-border px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div>
        <label htmlFor="artwork-desc-ua" className="block text-xs text-secondary mb-1 uppercase tracking-wider">
          Description (UA)
        </label>
        <textarea
          id="artwork-desc-ua"
          rows={3}
          value={form.descriptionUa}
          onChange={(e) => update("descriptionUa", e.target.value)}
          className="w-full border border-border px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-foreground text-background text-sm tracking-wider uppercase disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
        <a
          href={`/${locale}/admin/artworks`}
          className="px-6 py-2 border border-border text-sm tracking-wider uppercase"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
