import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // No user, or user registered via a non-credentials method
        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          return null;
        }

        // Banned users cannot authenticate
        if (user.banned) {
          throw new Error("banned");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      // Block banned users from signing in at all
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { banned: true },
        });
        if (dbUser?.banned) {
          return "/auth/error?error=banned";
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) ?? "member";
        session.user.banned = (token.banned as boolean) ?? false;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // On first sign-in, copy role from the adapter-provided user
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "member";
      }

      // Client-initiated session.update({ name }) — reflect the new name
      // in the token immediately (e.g. after editing the profile)
      if (trigger === "update") {
        const next = session as { name?: string } | undefined;
        if (typeof next?.name === "string") {
          token.name = next.name;
        }
      }

      // On every token refresh, re-check banned, role & name from the database
      // so bans take effect immediately and the name stays current
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { banned: true, role: true, name: true },
        });

        if (dbUser) {
          token.banned = dbUser.banned;
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      }

      return token;
    },
  },
};
