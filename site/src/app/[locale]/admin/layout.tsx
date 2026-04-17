import { requireOwner } from "@/lib/auth-helpers";
import Link from "next/link";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await requireOwner();
  const { locale } = await params;

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      <aside className="w-56 border-r border-border p-6 space-y-4 hidden lg:block">
        <h2 className="text-sm font-bold tracking-wider uppercase text-secondary">
          Admin
        </h2>
        <nav className="space-y-2 text-sm">
          <Link
            href={`/${locale}/admin`}
            className="block py-1 hover:text-foreground text-secondary"
          >
            Dashboard
          </Link>
          <Link
            href={`/${locale}/admin/artworks`}
            className="block py-1 hover:text-foreground text-secondary"
          >
            Artworks
          </Link>
          <Link
            href={`/${locale}/admin/collections`}
            className="block py-1 hover:text-foreground text-secondary"
          >
            Collections
          </Link>
          <Link
            href={`/${locale}/admin/orders`}
            className="block py-1 hover:text-foreground text-secondary"
          >
            Orders
          </Link>
          <Link
            href={`/${locale}/admin/settings`}
            className="block py-1 hover:text-foreground text-secondary"
          >
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
