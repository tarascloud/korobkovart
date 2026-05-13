/**
 * TODO(REV-08-PHASE-D-5-KO): replace these helpers with
 *   `import { createAuthHelpers } from "@taras-cloud/security/auth-helpers"`
 *   const { requireAuth, requireOwner } = createAuthHelpers({ auth, prisma });
 * once the package is published to GitHub Packages AND the scaffold's
 * auth-helpers.ts is refactored from path-alias-assumption to a DI
 * factory (currently it imports `@/auth` and `@/lib/prisma` which won't
 * resolve from a published npm package).
 *
 * See `vs-private/docs/adr/shared-security-package.md` §"Update 2026-05-13"
 * for the 6 pre-conditions. Until then, KO keeps its own redirect-based
 * helpers — they intentionally use Next.js `redirect()` (not return-
 * object), which matches the SH "page guard" variant in the scaffold ADR.
 */
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
