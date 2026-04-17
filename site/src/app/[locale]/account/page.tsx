import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AccountPage } from "@/components/account/AccountPage";

export default async function AccountPageRoute() {
  const session = await requireAuth();
  const userId = session.user!.id;

  const [user, addresses, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, image: true },
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        artwork: { select: { title: true, imagePath: true } },
      },
    }),
  ]);

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <AccountPage
      user={user}
      addresses={JSON.parse(JSON.stringify(addresses))}
      orders={JSON.parse(JSON.stringify(orders))}
    />
  );
}
