import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Assign OWNER role on first login if email matches
      if (user.email === OWNER_EMAIL) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser && dbUser.role !== "OWNER") {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "OWNER" },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).role = (user as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
