import { requireOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  await requireOwner();

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wider mb-8">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
