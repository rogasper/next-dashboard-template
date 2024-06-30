import "server-only";
import { cache } from "react";
import { lucia, validateRequest } from "./auth";
import { AuthenticationError } from "@/use-cases/error";
import { UserId } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }

  return session.user;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return user;
};

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
