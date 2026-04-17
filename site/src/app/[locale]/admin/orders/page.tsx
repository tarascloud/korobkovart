import { prisma } from "@/lib/prisma";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      artwork: { select: { title: true, imagePath: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-6">
        Orders
      </h1>
      <OrderTable orders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
