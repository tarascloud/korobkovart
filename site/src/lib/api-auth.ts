import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function requireOwnerApi() {
  const session = await auth();
  if (!session?.user || (session.user as Record<string, unknown>).role !== "OWNER") {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), session: null };
  }
  return { error: null, session };
}

export async function requireAuthApi() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null, userId: "" };
  }
  return { error: null, session, userId: session.user.id as string };
}
