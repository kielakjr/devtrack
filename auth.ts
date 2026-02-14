import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } =
  NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
      }),
    ],

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
        }
        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
        }
        return session;
      },
    },

    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
  });
