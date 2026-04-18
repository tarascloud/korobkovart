import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pg from "pg";

function createClient() {
  return new pg.Client({
    connectionString: process.env.VS_DATABASE_URL || "postgresql://vs:vs2026secure@pg:5432/vs",
  });
}

async function requireOwnerSession() {
  const session = await auth();
  if (!session?.user || (session.user as Record<string, unknown>).role !== "OWNER") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireOwnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const client = createClient();

  try {
    await client.connect();

    const initiatives = await client.query(`
      SELECT id, title, status, "rawIdea", summary
      FROM "Initiative"
      WHERE "projectId" = 'ko_ba5c566683f7ebfdc267'
      ORDER BY "createdAt" DESC
    `);

    const tasks = await client.query(`
      SELECT t.id, t."ticketId", t.title, t.description, t.status, t.priority,
             t."assigneeType", t."acceptanceCriteria", t."completedAt", t."createdAt",
             t."initiativeId"
      FROM "Task" t
      WHERE t."projectId" = 'ko_ba5c566683f7ebfdc267'
      ORDER BY t.status, t."ticketId"
    `);

    return NextResponse.json({
      initiatives: initiatives.rows,
      initiative: initiatives.rows[0] || null,
      tasks: tasks.rows,
    });
  } catch (error) {
    console.error("[VS Tasks] Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  } finally {
    await client.end().catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  const session = await requireOwnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const client = createClient();

  try {
    const body = await req.json();
    await client.connect();

    if (body.action === "create_task") {
      const id = `ko-t${Date.now()}`;
      await client.query(
        `INSERT INTO "Task" (id, "ticketId", title, description, status, priority, "assigneeType", "projectId", "initiativeId", type, "acceptanceCriteria", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, 'TODO', $5, $6, 'ko_ba5c566683f7ebfdc267', $7, 'FEATURE', $8, NOW(), NOW())`,
        [
          id,
          body.ticketId,
          body.title,
          body.description || "",
          body.priority || 5,
          body.assigneeType || "AGENT",
          body.initiativeId || "ko-unify-20260417",
          body.acceptanceCriteria || "",
        ]
      );
      return NextResponse.json({ success: true, id });
    }

    if (body.action === "update_status") {
      await client.query(
        `UPDATE "Task" SET status = $1, "completedAt" = ${body.status === "DONE" ? "NOW()" : "NULL"}, "updatedAt" = NOW() WHERE id = $2`,
        [body.status, body.taskId]
      );
      return NextResponse.json({ success: true });
    }

    if (body.action === "create_initiative") {
      const id = `ko-init-${Date.now()}`;
      await client.query(
        `INSERT INTO "Initiative" (id, title, "rawIdea", summary, status, priority, "userId", "projectId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, 'PLANNING', 2, 'cmnby7pes0000ob01krrz4qym', 'ko_ba5c566683f7ebfdc267', NOW(), NOW())`,
        [id, body.title, body.description || body.title, body.summary || ""]
      );
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[VS Tasks] Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  } finally {
    await client.end().catch(() => {});
  }
}
