// Push the Prisma schema to the database during build.
// If no database URL is configured we skip silently so the marketing site
// can still build (the auth-gated app pages will return a friendly error
// at runtime until Postgres is provisioned).

import { spawnSync } from "node:child_process";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (!url) {
  console.warn(
    "[docuticks] No DATABASE_URL set — skipping `prisma db push`. " +
      "Connect a Neon database (or any Postgres) and redeploy to enable login.",
  );
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--skip-generate", "--accept-data-loss"],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
