import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import NextAuth from "next-auth";
import nodemailer from "next-auth/providers/nodemailer";
import { env } from "~/env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    nodemailer({
      sendVerificationRequest: ({ url }) => {
        if (env.NODE_ENV === "development") {
          console.log(`🔑 Login link: ${url}`);
        }
      },
    }),
  ],
  experimental: { enableWebAuthn: true },
});
