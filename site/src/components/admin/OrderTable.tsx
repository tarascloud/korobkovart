"use client";

import { useState } from "react";

const ORDER_STATUSES = ["INQUIRY", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const statusColors: Record<string, string> = {
  INQUIRY: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

interface OrderRow {
  id: string;
  status: string;
  carrierName: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  artwork: { title: string; imagePath: string };
}

export function OrderTable({ orders: initial }: { orders: OrderRow[] }) {
  const [orders, setOrders] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-4 font-medium text-secondary">Order</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Buyer</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Artwork</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Status</th>
            <th className="pb-3 pr-4 font-medium text-secondary">Carrier</th>
            <th className="pb-3 font-medium text-secondary">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border/50">
              <td className="py-3 pr-4 font-mono text-xs">
                {o.id.slice(0, 8)}...
              </td>
              <td className="py-3 pr-4">
                <p className="font-medium">{o.user.name || "No name"}</p>
                <p className="text-xs text-secondary">{o.user.email}</p>
              </td>
              <td className="py-3 pr-4">{o.artwork.title}</td>
              <td className="py-3 pr-4">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  disabled={updating === o.id}
                  className={`px-2 py-1 text-xs rounded border-0 cursor-pointer disabled:opacity-50 ${statusColors[o.status] || ""}`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 pr-4 text-xs">
                {o.carrierName || "-"}
                {o.trackingNumber && (
                  <span className="block text-secondary">{o.trackingNumber}</span>
                )}
              </td>
              <td className="py-3 text-xs text-secondary">
                {new Date(o.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-secondary">
                No orders yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
