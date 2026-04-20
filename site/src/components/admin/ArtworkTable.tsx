"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  year: number;
  series: string;
  status: string;
  imagePath: string;
  featured: boolean;
  sortOrder: number;
}

type SortColumn = "title" | "year" | "series" | "status" | "featured" | "sortOrder";

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  sold: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  on_exhibition: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  exists: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400",
};

export function ArtworkTable({
  artworks: initial,
}: {
  artworks: ArtworkRow[];
}) {
  const t = useTranslations("admin");
  const [artworks, setArtworks] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<SortColumn>("sortOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleSort(col: SortColumn) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  const sorted = [...artworks].sort((a, b) => {
    let valA: string | number | boolean = a[sortCol];
    let valB: string | number | boolean = b[sortCol];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (typeof valA === "boolean") valA = valA ? 1 : 0;
    if (typeof valB === "boolean") valB = valB ? 1 : 0;
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const arrow = (col: SortColumn) =>
    sortCol === col ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";

  function handleDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function executeDelete() {
    const id = confirmDeleteId;
    if (!id) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArtworks((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-border p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                <Image
                  src={a.imagePath}
                  alt={a.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{a.title}</div>
                <div className="text-xs text-secondary mt-0.5">
                  {a.year} · <span className="capitalize">{a.series}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${statusColors[a.status] || "bg-gray-100"}`}
                  >
                    {a.status.replace("_", " ")}
                  </span>
                  {a.featured && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <span className="text-xs text-secondary">
                #{a.sortOrder}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/artworks/${a.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t("edit")}
                </Link>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deleting === a.id}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting === a.id ? "..." : t("delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
        {artworks.length === 0 && (
          <p className="py-8 text-center text-secondary">{t("no_artworks")}</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4 font-medium text-secondary">{t("image")}</th>
              <th
                onClick={() => handleSort("title")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("title_field")}{arrow("title")}
              </th>
              <th
                onClick={() => handleSort("year")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("year")}{arrow("year")}
              </th>
              <th
                onClick={() => handleSort("series")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("series")}{arrow("series")}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("status")}{arrow("status")}
              </th>
              <th
                onClick={() => handleSort("featured")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("featured")}{arrow("featured")}
              </th>
              <th
                onClick={() => handleSort("sortOrder")}
                className="pb-3 pr-4 font-medium text-secondary cursor-pointer hover:text-foreground select-none"
              >
                {t("sort_order")}{arrow("sortOrder")}
              </th>
              <th className="pb-3 font-medium text-secondary">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-3 pr-4">
                  <div className="relative w-10 h-10 bg-muted rounded overflow-hidden">
                    <Image src={a.imagePath} alt={a.title} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="py-3 pr-4 font-medium">{a.title}</td>
                <td className="py-3 pr-4 text-secondary">{a.year}</td>
                <td className="py-3 pr-4 text-secondary capitalize">{a.series}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 text-xs rounded ${statusColors[a.status] || "bg-gray-100"}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 pr-4 text-secondary">{a.featured ? "★" : "—"}</td>
                <td className="py-3 pr-4 text-secondary">{a.sortOrder}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/artworks/${a.id}`} className="text-sm text-blue-600 hover:underline">
                      {t("edit")}
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deleting === a.id ? "..." : t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-secondary">
                  {t("no_artworks")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      <ConfirmDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        title={t("confirm_delete")}
        confirmLabel={t("delete")}
        onConfirm={executeDelete}
        destructive
      />
    </div>
    </>
  );
}
