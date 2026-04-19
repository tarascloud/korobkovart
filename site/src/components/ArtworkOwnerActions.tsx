"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { ArtworkStatus } from "@/lib/types";

const statuses: { value: ArtworkStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "on-exhibition", label: "On Exhibition" },
  { value: "exists", label: "Exists" },
];

export function ArtworkOwnerActions({
  artwork,
  isOwner,
}: {
  artwork: { id: string; status: ArtworkStatus; featured?: boolean };
  isOwner: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ArtworkStatus>(artwork.status);
  const [featured, setFeatured] = useState(artwork.featured ?? false);
  const [saving, setSaving] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!isOwner) return null;

  async function handleSave() {
    setSaving(true);
    try {
      const apiStatus = status === "on-exhibition" ? "on_exhibition" : status;
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus, featured }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to update artwork:", data);
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md text-secondary hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Edit artwork"
        title="Quick edit"
      >
        <Pencil size={16} strokeWidth={2} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-lg border border-border bg-background shadow-lg p-4 space-y-3"
        >
          <div>
            <label htmlFor="artwork-quick-status" className="text-xs text-secondary uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              id="artwork-quick-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ArtworkStatus)}
              className="w-full text-sm rounded-md border border-border bg-background px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="artwork-quick-featured" className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              id="artwork-quick-featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-border"
            />
            Featured
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full text-xs uppercase tracking-wider bg-foreground text-background rounded-md py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
