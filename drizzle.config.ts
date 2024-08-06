import type { Config } from "drizzle-kit";

import { env } from "~/env";

export default {
	schema: "./src/server/db/schema.ts",
	dialect: "sqlite",
	out: "./src/migrations",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config;
