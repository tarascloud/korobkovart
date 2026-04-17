"use client";

import { useState, type FormEvent } from "react";

interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  artworks: { artworkId: string; artwork: { id: string; title: string; imagePath: string } }[];
}

interface ArtworkOption {
  id: string;
  title: string;
}

export function CollectionManager({
  collections: initial,
  allArtworks,
}: {
  collections: CollectionRow[];
  allArtworks: ArtworkOption[];
}) {
  const [collections, setCollections] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingArtwork, setAddingArtwork] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/collections");
    if (res.ok) {
      const data = await res.json();
      setCollections(data);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (res.ok) {
        setName("");
        setSlug("");
        setShowForm(false);
        await reload();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection?")) return;
    const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    if (res.ok) await reload();
  }

  async function handleAddArtwork(collectionId: string) {
    if (!selectedArtwork) return;
    const res = await fetch(`/api/admin/collections/${collectionId}/artworks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworkId: selectedArtwork }),
    });
    if (res.ok) {
      setSelectedArtwork("");
      setAddingArtwork(null);
      await reload();
    }
  }

  async function handleRemoveArtwork(collectionId: string, artworkId: string) {
    const res = await fetch(`/api/admin/collections/${collectionId}/artworks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworkId }),
    });
    if (res.ok) await reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider uppercase">
          Collections
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase"
        >
          {showForm ? "Cancel" : "+ New Collection"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-border p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-"),
                  );
                }}
                className="w-full border border-border px-3 py-2 text-sm bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                Slug
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {collections.map((c) => (
          <div key={c.id} className="border border-border p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-bold">{c.name}</h3>
                <p className="text-xs text-secondary">
                  /{c.slug} &middot; {c.artworks.length} artworks
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setAddingArtwork(addingArtwork === c.id ? null : c.id)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add artwork
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {addingArtwork === c.id && (
              <div className="flex gap-2 mb-3">
                <select
                  value={selectedArtwork}
                  onChange={(e) => setSelectedArtwork(e.target.value)}
                  className="flex-1 border border-border px-3 py-1 text-sm bg-transparent"
                >
                  <option value="">Select artwork...</option>
                  {allArtworks
                    .filter(
                      (a) => !c.artworks.some((ca) => ca.artworkId === a.id),
                    )
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => handleAddArtwork(c.id)}
                  className="px-3 py-1 bg-foreground text-background text-sm"
                >
                  Add
                </button>
              </div>
            )}

            {c.artworks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {c.artworks.map((ca) => (
                  <span
                    key={ca.artworkId}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border"
                  >
                    {ca.artwork.title}
                    <button
                      onClick={() =>
                        handleRemoveArtwork(c.id, ca.artworkId)
                      }
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {collections.length === 0 && (
          <p className="text-center text-secondary py-8">
            No collections yet
          </p>
        )}
      </div>
    </div>
  );
}
