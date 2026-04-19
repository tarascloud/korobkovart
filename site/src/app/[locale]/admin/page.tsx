import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

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
    {
      label: "Total Artworks",
      value: totalArtworks,
      href: "/admin/artworks",
      accent: "border-l-foreground/40",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      label: "Available",
      value: available,
      href: "/admin/artworks",
      accent: "border-l-foreground/20",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      ),
    },
    {
      label: "Sold",
      value: sold,
      href: "/admin/artworks",
      accent: "border-l-foreground/20",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: "Total Orders",
      value: totalOrders,
      href: "/admin/orders",
      accent: "border-l-foreground/40",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: "Pending Inquiries",
      value: pendingOrders,
      href: "/admin/orders",
      accent: pendingOrders > 0 ? "border-l-foreground" : "border-l-foreground/20",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`border border-border border-l-[3px] ${s.accent} p-4 hover:bg-muted/40 transition-colors duration-200 group`}
          >
            <div className="flex items-center gap-2 text-secondary mb-2 group-hover:text-foreground transition-colors">
              {s.icon}
              <p className="text-xs uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-3xl font-bold font-mono">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
