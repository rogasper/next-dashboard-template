"use server";
import { initChangePasswordActions } from "./(auth)/reset-password/action";
import { initSignInActions } from "./(auth)/sign-in/email/action";
import { initResetPasswordActions } from "./(auth)/sign-in/forgot-password/action";
import { initSignUpActions } from "./(auth)/sign-up/action";

export async function initAction() {
  await initSignUpActions();
  await initSignInActions();
  await initResetPasswordActions();
  await initChangePasswordActions();
}
