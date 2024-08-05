import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import NextAuth from "next-auth";
import nodemailer from "next-auth/providers/nodemailer";
import { env } from "~/env";
import { PUBLIC_APP_DOMAIN } from "~/constants/app";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

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
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? `.${PUBLIC_APP_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
});
