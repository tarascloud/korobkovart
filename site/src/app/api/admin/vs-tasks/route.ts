import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/api-auth";

const VS_API_BASE = "https://vs.taras.cloud/api";

/**
 * Runtime ID resolution with 5-min TTL cache (mirrors sh-workflow resolveIds()).
 *
 * Why: hardcoded `KO_PROJECT_ID = "ko_ba5c566683f7ebfdc267"` and fallback
 * `initiativeId: "ko-unify-20260417"` silently broke whenever the VS DB
 * was reseeded or the initiative was archived. Now: env var supplies the
 * project ID; the default active initiative is fetched from VS API and
 * cached. If lookup fails, the request returns 500 — better than silently
 * pointing at stale or wrong IDs.
 */
const ID_CACHE_TTL_MS = 5 * 60 * 1000;
type IdCache = {
  projectId: string;
  defaultInitiativeId: string;
  fetchedAt: number;
};
let idCache: IdCache | null = null;

function getHeaders(): HeadersInit {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    throw new Error("INTERNAL_API_SECRET environment variable is not set");
  }
  return {
    "Content-Type": "application/json",
    "x-internal-secret": secret,
  };
}

function getProjectId(): string {
  const projectId = process.env.VS_KO_PROJECT_ID;
  if (!projectId) {
    throw new Error("VS_KO_PROJECT_ID environment variable is not set");
  }
  return projectId;
}

type VsInitiative = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

async function resolveIds(): Promise<IdCache> {
  if (idCache && Date.now() - idCache.fetchedAt < ID_CACHE_TTL_MS) {
    return idCache;
  }
  const projectId = getProjectId();
  const headers = getHeaders();

  // Look up active initiative for KO project. Prefer IN_PROGRESS, fall back to
  // PLANNING/IDEA (most recent). If none exist, fail loudly — no stale defaults.
  const res = await fetch(`${VS_API_BASE}/initiatives?projectId=${projectId}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `VS API initiatives lookup failed: ${res.status} ${await res.text()}`,
    );
  }
  const raw = await res.json();
  const list: VsInitiative[] = Array.isArray(raw) ? raw : raw.data ?? [];
  // Newest first (VS API already orders by createdAt desc, but be defensive)
  const active = list
    .filter((i) => ["IN_PROGRESS", "PLANNING", "PLANNED", "IDEA"].includes(i.status))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  if (active.length === 0) {
    throw new Error(
      `No active initiative found for KO project (${projectId}). Create one in VS before creating tasks.`,
    );
  }
  const inProgress = active.find((i) => i.status === "IN_PROGRESS");
  idCache = {
    projectId,
    defaultInitiativeId: (inProgress ?? active[0]).id,
    fetchedAt: Date.now(),
  };
  return idCache;
}

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const ids = await resolveIds();
    const headers = getHeaders();

    const [initiativesRes, tasksRes] = await Promise.all([
      fetch(`${VS_API_BASE}/initiatives?projectId=${ids.projectId}`, { headers }),
      fetch(`${VS_API_BASE}/tasks?projectId=${ids.projectId}`, { headers }),
    ]);

    if (!initiativesRes.ok) {
      console.error("[VS Tasks] Initiatives API error:", initiativesRes.status, await initiativesRes.text());
      return NextResponse.json({ error: "Failed to fetch initiatives" }, { status: 502 });
    }
    if (!tasksRes.ok) {
      console.error("[VS Tasks] Tasks API error:", tasksRes.status, await tasksRes.text());
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 502 });
    }

    const initiatives = await initiativesRes.json();
    const tasks = await tasksRes.json();

    const initiativesList = Array.isArray(initiatives) ? initiatives : initiatives.data ?? [];
    const tasksList = Array.isArray(tasks) ? tasks : tasks.data ?? [];

    return NextResponse.json({
      initiatives: initiativesList,
      initiative: initiativesList[0] || null,
      tasks: tasksList,
    });
  } catch (err) {
    console.error("[VS Tasks] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await req.json();
    const ids = await resolveIds();
    const headers = getHeaders();

    if (body.action === "create_task") {
      const initiativeId = body.initiativeId || ids.defaultInitiativeId;
      const res = await fetch(`${VS_API_BASE}/tasks`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: body.title,
          ticketId: body.ticketId,
          description: body.description || "",
          status: "TODO",
          priority: body.priority || 5,
          assigneeType: body.assigneeType || "AGENT",
          projectId: ids.projectId,
          initiativeId,
          type: "FEATURE",
          acceptanceCriteria: body.acceptanceCriteria || "",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[VS Tasks] Create task error:", res.status, text);
        return NextResponse.json({ error: "Failed to create task" }, { status: 502 });
      }

      const task = await res.json();
      return NextResponse.json({ success: true, id: task.id });
    }

    if (body.action === "update_status") {
      const res = await fetch(`${VS_API_BASE}/tasks/${body.taskId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          status: body.status,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[VS Tasks] Update status error:", res.status, text);
        return NextResponse.json({ error: "Failed to update status" }, { status: 502 });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === "create_initiative") {
      const res = await fetch(`${VS_API_BASE}/initiatives`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: body.title,
          rawIdea: body.description || body.title,
          summary: body.summary || "",
          status: "PLANNING",
          priority: 2,
          projectId: ids.projectId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[VS Tasks] Create initiative error:", res.status, text);
        return NextResponse.json({ error: "Failed to create initiative" }, { status: 502 });
      }

      const initiative = await res.json();
      return NextResponse.json({ success: true, id: initiative.id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[VS Tasks] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}
