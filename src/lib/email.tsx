import { env } from "@/env";
import { ReactNode } from "react";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { BASE_URL } from "@/emails/verify-email";

// change provider to nodemailer
// const resend = new Resend(env.EMAIL_SERVER_PASSWORD);
const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail(
  email: string,
  subject: string,
  // body: React.ReactElement
  verify: boolean,
  token: string
) {
  try {
    await transporter.sendMail({
      from: "onboarding@resend.dev",
      to: email,
      subject,
      html: `<a
      href="${
        verify
          ? `${BASE_URL}/api/login/verify-email?token=${token}`
          : `${BASE_URL}/reset-password?token=${token}`
      }"
      target="_blank"
    >
      ${verify ? "Verify Email" : "Reset Password"}
    </a>`,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
