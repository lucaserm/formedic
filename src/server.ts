import { exec } from "node:child_process";
import util from "node:util";

import chalk from "chalk";

import { app } from "./app";
import { env } from "./env";
import { makeAlertService } from "./services/_factories/make-alert-service";

const execAsync = util.promisify(exec);

if (env.DATABASE_AUTO_MIGRATION) {
  const alert = makeAlertService();

  console.log("\n🚛 Running database migrations...");
  try {
    const { stdout } = await execAsync("bun drizzle-kit migrate");
    console.log(chalk.gray(stdout));
    console.log("✅ Database migration completed.\n");
  } catch (error) {
    await alert.warn({
      title: "Migração do banco de dados falhou",
      description: String(error),
      needsAttention: true,
    });
    process.exit(1);
  }
} else {
  logger.log({ message: "💾 Database migration skipped.", type: "warn" });
}

app.listen({ port: env.PORT, hostname: "0.0.0.0" }, async ({ url }) => {
  const metricsUrl = new URL("/metrics", url);

  console.log(`🚀 HTTP server running at ${url}`);
  console.log(`📊 Metrics available at ${metricsUrl.toString()}`);

  if (env.NODE_ENV !== "production") {
    const docsUrl = new URL("/docs", url);
    console.log(`📚 Docs available at ${docsUrl.toString()}`);
  }

  if (!Number.isFinite(env.MAX_REQUESTS_PER_MINUTE)) {
    console.warn("⚠️  Rate limiting is disabled.");
  }
});
