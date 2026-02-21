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
        authorization: {
          params: {
            scope: "read:user repo user:email",
          },
        },
      }),
    ],

    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
        }
        if (account?.access_token) {
          token.accessToken = account.access_token;
        }
        return token;
      },

      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.accessToken = token.accessToken as string;
        }
        return session;
      },
    },

    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
  });
