import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";

import { env } from "./env";
import { errorHandler } from "./http/plugins/error-handler";
import { rateLimitPlugin } from "./http/plugins/rate-limit-plugin";
import { requestCounter } from "./http/plugins/request-counter";
import { scheduleRoutes } from "./http/routes/schedule/routes";

export const app = new Elysia()
  .onError(errorHandler())
  .onAfterResponse(requestCounter)
  .use(cors({ origin: env.WEB_URL }))
  .use(
    rateLimitPlugin({
      duration: 1000 * 60 * 1, // 1 minute
      max: env.MAX_REQUESTS_PER_MINUTE,
    }),
  )
  .use(
    openapi({
      path: "/docs",
      specPath: "/docs/json",
      enabled: env.NODE_ENV !== "production",
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    }),
  )
  .get("/", () => "Ok")
  .use(scheduleRoutes);
