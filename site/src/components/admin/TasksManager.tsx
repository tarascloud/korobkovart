"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  assigneeType: string;
  acceptanceCriteria: string;
  completedAt: string | null;
  createdAt: string;
  initiativeId: string;
}

interface Initiative {
  id: string;
  title: string;
  status: string;
  rawIdea: string;
  summary: string;
}

interface NewTaskForm {
  ticketId: string;
  title: string;
  description: string;
  priority: number;
  assigneeType: "AGENT" | "OWNER";
  acceptanceCriteria: string;
}

interface NewInitiativeForm {
  title: string;
  description: string;
  summary: string;
}

const emptyTask: NewTaskForm = {
  ticketId: "",
  title: "",
  description: "",
  priority: 5,
  assigneeType: "AGENT",
  acceptanceCriteria: "",
};

const emptyInitiative: NewInitiativeForm = {
  title: "",
  description: "",
  summary: "",
};

export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewInitiative, setShowNewInitiative] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>(emptyTask);
  const [newInitiative, setNewInitiative] =
    useState<NewInitiativeForm>(emptyInitiative);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    fetch("/api/admin/vs-tasks")
      .then((r) => r.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setInitiatives(data.initiatives || []);
        if (!selectedInitiativeId && data.initiatives?.length > 0) {
          setSelectedInitiativeId(data.initiatives[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedInitiativeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = selectedInitiativeId
    ? tasks.filter((t) => t.initiativeId === selectedInitiativeId)
    : tasks;

  const selectedInitiative = initiatives.find(
    (i) => i.id === selectedInitiativeId
  );

  const done = filteredTasks.filter((t) => t.status === "DONE");
  const todo = filteredTasks.filter((t) => t.status !== "DONE");

  async function handleToggleStatus(task: Task) {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    const res = await fetch("/api/admin/vs-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_status",
        taskId: task.id,
        status: newStatus,
      }),
    });
    if (res.ok) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: newStatus,
                completedAt:
                  newStatus === "DONE" ? new Date().toISOString() : null,
              }
            : t
        )
      );
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.title || !newTask.ticketId) return;
    setSaving(true);
    const res = await fetch("/api/admin/vs-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_task",
        ...newTask,
        initiativeId: selectedInitiativeId || "ko-unify-20260417",
      }),
    });
    if (res.ok) {
      setNewTask(emptyTask);
      setShowNewTask(false);
      fetchData();
    }
    setSaving(false);
  }

  async function handleCreateInitiative(e: React.FormEvent) {
    e.preventDefault();
    if (!newInitiative.title) return;
    setSaving(true);
    const res = await fetch("/api/admin/vs-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_initiative",
        ...newInitiative,
      }),
    });
    if (res.ok) {
      setNewInitiative(emptyInitiative);
      setShowNewInitiative(false);
      fetchData();
    }
    setSaving(false);
  }

  function generateNextTicketId() {
    const koTasks = tasks
      .map((t) => t.ticketId)
      .filter((id) => /^KO-\d+$/.test(id))
      .map((id) => parseInt(id.replace("KO-", ""), 10));
    const maxNum = koTasks.length > 0 ? Math.max(...koTasks) : 0;
    const next = String(maxNum + 1).padStart(3, "0");
    return `KO-${next}`;
  }

  if (loading) return <div className="animate-pulse h-40 bg-muted" />;

  return (
    <div className="space-y-8">
      {/* Initiative selector + New Initiative button */}
      <div className="flex items-center gap-4 flex-wrap">
        {initiatives.length > 1 && (
          <select
            value={selectedInitiativeId || ""}
            onChange={(e) => setSelectedInitiativeId(e.target.value)}
            className="border border-border bg-background text-foreground px-3 py-1.5 text-sm"
          >
            {initiatives.map((init) => (
              <option key={init.id} value={init.id}>
                {init.title} ({init.status})
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => setShowNewInitiative(!showNewInitiative)}
          className="text-sm border border-border px-3 py-1.5 hover:bg-muted transition-colors"
        >
          {showNewInitiative ? "Cancel" : "+ New Initiative"}
        </button>
      </div>

      {/* New Initiative form */}
      {showNewInitiative && (
        <form
          onSubmit={handleCreateInitiative}
          className="border border-border p-4 space-y-3"
        >
          <input
            type="text"
            placeholder="Initiative title"
            value={newInitiative.title}
            onChange={(e) =>
              setNewInitiative({ ...newInitiative, title: e.target.value })
            }
            className="w-full border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <textarea
            placeholder="Description / raw idea"
            value={newInitiative.description}
            onChange={(e) =>
              setNewInitiative({
                ...newInitiative,
                description: e.target.value,
              })
            }
            className="w-full border border-border bg-background px-3 py-2 text-sm h-20"
          />
          <textarea
            placeholder="Summary"
            value={newInitiative.summary}
            onChange={(e) =>
              setNewInitiative({ ...newInitiative, summary: e.target.value })
            }
            className="w-full border border-border bg-background px-3 py-2 text-sm h-16"
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background px-4 py-2 text-sm hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Initiative"}
          </button>
        </form>
      )}

      {/* Selected initiative info */}
      {selectedInitiative && (
        <div className="border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">{selectedInitiative.title}</h2>
            <Badge
              variant={
                selectedInitiative.status === "DONE" ? "success" : "default"
              }
            >
              {selectedInitiative.status}
            </Badge>
          </div>
          <p className="text-sm text-secondary">
            {selectedInitiative.rawIdea}
          </p>
          <p className="text-xs text-secondary mt-2">
            {done.length} / {filteredTasks.length} completed
          </p>
          <div className="mt-2 h-2 bg-muted rounded">
            <div
              className="h-2 bg-green-500 rounded transition-all"
              style={{
                width: `${filteredTasks.length ? (done.length / filteredTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* New Task creation removed — tasks are created via VS */}

      {/* TODO tasks */}
      {todo.length > 0 && (
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-secondary mb-4">
            TODO ({todo.length})
          </h3>
          <div className="space-y-2">
            {todo.map((task) => (
              <TaskRow
                key={task.ticketId}
                task={task}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* DONE tasks */}
      {done.length > 0 && (
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-secondary mb-4">
            DONE ({done.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {done.map((task) => (
              <TaskRow
                key={task.ticketId}
                task={task}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggleStatus,
}: {
  task: Task;
  onToggleStatus: (task: Task) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border p-4">
      <div
        className="flex items-start justify-between gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-secondary">
              {task.ticketId}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(task);
              }}
              title={
                task.status === "DONE" ? "Mark as TODO" : "Mark as DONE"
              }
            >
              <Badge
                variant={task.status === "DONE" ? "success" : "outline"}
                className="text-[10px] cursor-pointer hover:opacity-70"
              >
                {task.status}
              </Badge>
            </button>
            <Badge variant="outline" className="text-[10px]">
              {task.assigneeType}
            </Badge>
          </div>
          <p className="text-sm font-medium mt-1">{task.title}</p>
        </div>
        <span className="text-xs text-secondary">
          {expanded ? "\u25B2" : "\u25BC"}
        </span>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border text-sm space-y-2">
          {task.description && (
            <p className="text-secondary">{task.description}</p>
          )}
          {task.acceptanceCriteria && (
            <div>
              <p className="text-xs font-bold text-secondary uppercase">
                Acceptance Criteria
              </p>
              <p className="text-secondary text-xs mt-1">
                {task.acceptanceCriteria}
              </p>
            </div>
          )}
          {task.completedAt && (
            <p className="text-xs text-secondary">
              Completed: {new Date(task.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
