import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/api-auth";

const VS_API_BASE = "https://vs.taras.cloud/api";
const KO_PROJECT_ID = "ko_ba5c566683f7ebfdc267";

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

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const headers = getHeaders();

    const [initiativesRes, tasksRes] = await Promise.all([
      fetch(`${VS_API_BASE}/initiatives?projectId=${KO_PROJECT_ID}`, { headers }),
      fetch(`${VS_API_BASE}/tasks?projectId=${KO_PROJECT_ID}`, { headers }),
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
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await req.json();
    const headers = getHeaders();

    if (body.action === "create_task") {
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
          projectId: KO_PROJECT_ID,
          initiativeId: body.initiativeId || "ko-unify-20260417",
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
          projectId: KO_PROJECT_ID,
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
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
