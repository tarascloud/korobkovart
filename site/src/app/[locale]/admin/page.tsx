import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalArtworks, available, sold, totalOrders, pendingOrders] =
    await Promise.all([
      prisma.artwork.count(),
      prisma.artwork.count({ where: { status: "available" } }),
      prisma.artwork.count({ where: { status: "sold" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "INQUIRY" } }),
    ]);

  const stats = [
    { label: "Total Artworks", value: totalArtworks },
    { label: "Available", value: available },
    { label: "Sold", value: sold },
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Inquiries", value: pendingOrders },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-4">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
