import { app } from "./app";
import { env } from "./env";

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
