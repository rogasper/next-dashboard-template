import { UserId } from "lucia";
import crypto from "crypto";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const ITERATIONS = 10000;

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function createAccount(userId: UserId, password: string) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  const account = await db.insert(accounts).values({
    userId,
    accountType: "email",
    password: hash,
    salt,
  });
  console.log("account from data-access ", account);
  return account;
}

export async function createAccountViaGoogle(userId: UserId, googleId: string) {
  await db.insert(accounts).values({
    userId: userId,
    accountType: "google",
    googleId,
  });
}

export async function getAccountByUserId(userId: UserId) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = db
) {
  const salt = crypto.randomBytes(128).toString("base64");
  const hash = await hashPassword(password, salt);
  await trx
    .update(accounts)
    .set({
      password: hash,
      salt,
    })
    .where(and(eq(accounts.userId, userId), eq(accounts.accountType, "email")));
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  });
}
