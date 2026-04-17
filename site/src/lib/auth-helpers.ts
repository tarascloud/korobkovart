import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireOwner() {
  const session = await requireAuth();
  if ((session.user as any).role !== "OWNER") {
    redirect("/");
  }
  return session;
}

export async function getSession() {
  return await auth();
}

export function isOwner(session: any): boolean {
  return session?.user?.role === "OWNER";
}
