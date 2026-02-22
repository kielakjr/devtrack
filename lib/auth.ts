'use server';
import { signIn, signOut } from "@/auth"
import { auth } from "@/auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/dashboard" })
}

export const logout = async () => {
  await signOut({ redirectTo: "/" })
}

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session) return null;
  return session.user;
}

export const getUserName = async () => {
  const user = await getCurrentUser();
  if (!user) return "Guest";
  return user?.name || "Unnamed User";
}
