"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  on_exhibition: "bg-blue-100 text-blue-800",
  exists: "bg-gray-100 text-gray-800",
};

export function ArtworkTable({
  artworks: initial,
  locale,
}: {
  artworks: ArtworkRow[];
  locale: string;
}) {
  const [artworks, setArtworks] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-medium text-secondary">Image</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Title</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Year</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Series</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Status</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Featured</th>
            <th className="pb-3 font-medium text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((a) => (
            <tr key={a.id} className="border-b border-border/50">
              <td className="py-3 pr-4">
                <div className="relative w-12 h-12 bg-muted">
                  <Image
                    src={a.imagePath}
                    alt={a.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </td>
              <td className="py-3 pr-4 font-medium">{a.title}</td>
              <td className="py-3 pr-4">{a.year}</td>
              <td className="py-3 pr-4 capitalize">{a.series}</td>
              <td className="py-3 pr-4">
                <span
                  className={`px-2 py-0.5 text-xs rounded ${statusColors[a.status] || "bg-gray-100"}`}
                >
                  {a.status.replace("_", " ")}
                </span>
              </td>
              <td className="py-3 pr-4">{a.featured ? "Yes" : ""}</td>
              <td className="py-3 space-x-3">
                <Link
                  href={`/${locale}/admin/artworks/${a.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deleting === a.id}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  {deleting === a.id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
          {artworks.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-secondary">
                No artworks yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
