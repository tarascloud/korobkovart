import { requireOwner } from "@/lib/auth-helpers";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await requireOwner();
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      <aside className="w-56 border-r border-border p-6 space-y-4 hidden lg:block">
        <h2 className="text-sm font-bold tracking-wider uppercase text-secondary">
          {t("title")}
        </h2>
        <nav className="space-y-2 text-sm">
          <Link
            href="/admin"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("dashboard")}
          </Link>
          <Link
            href="/admin/artworks"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("artworks")}
          </Link>
          <Link
            href="/admin/collections"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("collections")}
          </Link>
          <Link
            href="/admin/orders"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("orders")}
          </Link>
          <Link
            href="/admin/marketing"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("marketing")}
          </Link>
          <Link
            href="/admin/settings"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("settings")}
          </Link>
          <Link
            href="/admin/tasks"
            className="block py-1 hover:text-foreground text-secondary focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("tasks")}
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="lg:hidden mb-4">
          <AdminMobileNav />
        </div>
        {children}
      </main>
    </div>
  );
}
