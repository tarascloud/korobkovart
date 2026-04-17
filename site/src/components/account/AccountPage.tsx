"use client";

import { useState, useEffect, type FormEvent } from "react";

type Tab = "profile" | "addresses" | "orders";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
}

interface Address {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  zip: string;
  phone: string | null;
  isDefault: boolean;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  artwork: { title: string; imagePath: string };
}

const statusLabels: Record<string, string> = {
  INQUIRY: "Inquiry",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusColors: Record<string, string> = {
  INQUIRY: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function AccountPage({
  user: initialUser,
  addresses: initialAddresses,
  orders: initialOrders,
}: {
  user: UserProfile;
  addresses: Address[];
  orders: Order[];
}) {
  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState(initialUser);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [orders] = useState(initialOrders);

  // Profile state
  const [profileName, setProfileName] = useState(user.name || "");
  const [profilePhone, setProfilePhone] = useState(user.phone || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({
    name: "",
    country: "",
    city: "",
    address: "",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    setProfileName(user.name || "");
    setProfilePhone(user.phone || "");
  }, [user]);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setProfileMsg("Saved");
      }
    } finally {
      setProfileSaving(false);
    }
  }

  async function reloadAddresses() {
    const res = await fetch("/api/account/addresses");
    if (res.ok) setAddresses(await res.json());
  }

  function startEditAddress(addr: Address) {
    setEditingAddress(addr);
    setAddrForm({
      name: addr.name,
      country: addr.country,
      city: addr.city,
      address: addr.address,
      zip: addr.zip,
      phone: addr.phone || "",
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  }

  function startNewAddress() {
    setEditingAddress(null);
    setAddrForm({ name: "", country: "", city: "", address: "", zip: "", phone: "", isDefault: false });
    setShowAddressForm(true);
  }

  async function handleAddressSave(e: FormEvent) {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const url = editingAddress
        ? `/api/account/addresses/${editingAddress.id}`
        : "/api/account/addresses";
      const method = editingAddress ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      });
      if (res.ok) {
        setShowAddressForm(false);
        setEditingAddress(null);
        await reloadAddresses();
      }
    } finally {
      setAddrSaving(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (res.ok) await reloadAddresses();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "addresses", label: "Addresses" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        My Account
      </h1>

      <div className="flex gap-4 mb-8 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 px-2 text-sm tracking-wider uppercase transition-colors ${
              tab === t.key
                ? "border-b-2 border-foreground text-foreground"
                : "text-secondary hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-border px-3 py-2 text-sm bg-muted opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
              Phone
            </label>
            <input
              type="tel"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2 bg-foreground text-background text-sm tracking-wider uppercase disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Save"}
            </button>
            {profileMsg && (
              <span className="text-sm text-green-600">{profileMsg}</span>
            )}
          </div>
        </form>
      )}

      {/* Addresses Tab */}
      {tab === "addresses" && (
        <div className="space-y-4">
          <button
            onClick={startNewAddress}
            className="px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase"
          >
            + New Address
          </button>

          {showAddressForm && (
            <form
              onSubmit={handleAddressSave}
              className="border border-border p-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.name}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.country}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, country: e.target.value }))
                    }
                    className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, city: e.target.value }))
                    }
                    className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                    Zip *
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.zip}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, zip: e.target.value }))
                    }
                    className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={addrForm.address}
                  onChange={(e) =>
                    setAddrForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-secondary mb-1 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addrForm.phone}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full border border-border px-3 py-2 text-sm bg-transparent"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) =>
                        setAddrForm((p) => ({
                          ...p,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="w-4 h-4"
                    />
                    Default address
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={addrSaving}
                  className="px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase disabled:opacity-50"
                >
                  {addrSaving
                    ? "Saving..."
                    : editingAddress
                      ? "Update"
                      : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  className="px-4 py-2 border border-border text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {addresses.map((addr) => (
            <div key={addr.id} className="border border-border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {addr.name}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-foreground/10 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-secondary mt-1">
                    {addr.address}, {addr.city}, {addr.zip}
                  </p>
                  <p className="text-sm text-secondary">{addr.country}</p>
                  {addr.phone && (
                    <p className="text-sm text-secondary">{addr.phone}</p>
                  )}
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => startEditAddress(addr)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showAddressForm && (
            <p className="text-secondary py-4">No saved addresses</p>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="border border-border p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-muted relative shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.artwork.imagePath}
                  alt={o.artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{o.artwork.title}</p>
                <p className="text-xs text-secondary">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded shrink-0 ${statusColors[o.status] || ""}`}
              >
                {statusLabels[o.status] || o.status}
              </span>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-secondary py-4">No orders yet</p>
          )}
        </div>
      )}
    </div>
  );
}
