import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const smtpHost = process.env["SMTP_HOST"] ?? "smtp.gmail.com";
const smtpPort = Number(process.env["SMTP_PORT"] ?? "587");
const smtpUser = process.env["SMTP_USER"];
const smtpPass = process.env["SMTP_PASS"];
const appName = process.env["APP_NAME"] ?? "App";
const fromEmail =
  process.env["EMAIL_FROM"] ??
  (smtpUser ? `${appName} <${smtpUser}>` : `${appName} <no-reply@localhost>`);
const clientOrigin = process.env["CLIENT_ORIGIN"] ?? "http://localhost:5173";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

let transporter: Transporter | null = null;

const getTransporter = () => {
  if (!smtpUser || !smtpPass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }: SendEmailInput) => {
  const transport = getTransporter();

  if (!transport) {
    console.info(`[email skipped] ${subject} -> ${to}`);
    console.info(text);
    return;
  }

  try {
    await transport.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error(`[email failed] ${subject} -> ${to}`, error);

    if (process.env["NODE_ENV"] !== "production") {
      console.info(text);
    }

    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${clientOrigin}/verify-email?token=${token}`;

  if (process.env["NODE_ENV"] !== "production") {
    console.info(`[dev verification link] ${email}: ${verificationUrl}`);
  }

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Welcome to ${appName}.</p>
      <p>Verify your email address to activate your account.</p>
      <p><a href="${verificationUrl}">Verify email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
    text: [
      `Welcome to ${appName}.`,
      "Verify your email address to activate your account.",
      "",
      verificationUrl,
      "",
      "This link expires in 24 hours.",
    ].join("\n"),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${clientOrigin}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>
    `,
    text: [
      "You requested a password reset.",
      "",
      resetUrl,
      "",
      "This link expires in 30 minutes. If you did not request this, you can ignore this email.",
    ].join("\n"),
  });
};
