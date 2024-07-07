import {
  createUser,
  deleteSessionIfExist,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from "@/data-access/users";
import { AuthenticationError, EmailInUseError, LoginError } from "./error";
import {
  createAccount,
  createAccountViaGoogle,
  updatePassword,
} from "@/data-access/accounts";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "@/data-access/reset-tokens";
import { createProfile } from "@/data-access/profiles";
import { generateRandomName } from "@/lib/names";
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "@/data-access/verify-email";
import { sendEmail } from "@/lib/email";
import { applicationName } from "@/app-config";
import VerifyEmail from "@/emails/verify-email";
import { createTransaction } from "@/data-access/utils";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { GoogleUser } from "@/app/api/login/google/callback/route";

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  await deleteSessionIfExist(user.id);

  return { id: user.id };
}

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new EmailInUseError();
  }

  const user = await createUser(email);
  await createAccount(user.insertId, password);
  await createProfile(user.insertId, generateRandomName());

  const token = await createVerifyEmailToken(user.insertId);

  await sendEmail(
    email,
    `Verify your email address for ${applicationName}`,
    // VerifyEmail(token)
    true,
    token
  );

  return { id: user.insertId };
}

export async function resetPasswordUseCase(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AuthenticationError();
  }

  const token = await createPasswordResetToken(user.id);

  await sendEmail(
    email,
    `To reset your password for ${applicationName}`,
    // ResetPasswordEmail(token)
    false,
    token
  );
}

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token);
  if (!tokenEntry) {
    throw new AuthenticationError();
  }

  const userId = tokenEntry.userId;

  await updateUser(userId, { emailVerified: new Date(Date.now()) });
  await deleteVerifyEmailToken(token);
  return userId;
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry) {
    throw new AuthenticationError();
  }

  const userId = tokenEntry.userId;

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
  });
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    // existingUser = await createUser(googleUser.email);
    let newUser = await createUser(googleUser.email);
    newUser.insertId;
    await createAccountViaGoogle(newUser.insertId, googleUser.sub);

    await createProfile(newUser.insertId, googleUser.name, googleUser.picture);
    return newUser?.insertId;
  }

  await createAccountViaGoogle(existingUser?.id, googleUser.sub);

  await createProfile(existingUser?.id, googleUser.name, googleUser.picture);

  return existingUser?.id;
}
