import { db } from "@/db";
import { User, sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAccountByUserId, hashPassword } from "./accounts";
import { UserId } from "lucia";

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function createUser(email: string) {
  const [user] = await db.insert(users).values({
    email,
  });
  console.log("user from data-access ", user);
  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password === hash;
}

export async function deleteSessionIfExist(userId: UserId) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.userId, userId),
  });

  if (session) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
  }
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await db.update(users).set(updatedUser).where(eq(users.id, userId));
}
