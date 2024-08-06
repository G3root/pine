import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import NextAuth from "next-auth";
import Passkey from "next-auth/providers/passkey";
import { PUBLIC_APP_DOMAIN } from "~/constants/app";
import type { EmailConfig } from "next-auth/providers";

const mockEmail = {
	id: "email",
	name: "Email",
	type: "email",
	from: "mock@test.com",
	maxAge: 86400,
	generateVerificationToken: () => "supersecret",
	async sendVerificationRequest(opts) {
		await new Promise((r) => setTimeout(r, 500));
		console.log(`🔑 Login link: ${opts.url}`);
	},
	options: {},
} satisfies EmailConfig;

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const providers = [{ name: "passkey", handler: Passkey }] as const;

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		...providers.map((p) => p.handler),
		...(process.env.VERCEL_ENV !== "production" ? [mockEmail] : []),
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
	pages: {
		signIn: "/login",
	},
});
