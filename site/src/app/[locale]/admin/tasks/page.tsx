import { requireOwner } from "@/lib/auth-helpers";
import { TasksManager } from "@/components/admin/TasksManager";

export default async function AdminTasksPage() {
  await requireOwner();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        Tasks (VS Integration)
      </h1>
      <TasksManager />
    </div>
  );
}
