import type Elysia from "elysia";
import { rateLimit } from "elysia-rate-limit";

import { env } from "@/env";
import { TooManyRequestsError } from "@/errors/http/too-many-requests-error";

interface RateLimitPluginProps {
  max: number;
  duration: number;
  throws?: Error;
}

export function rateLimitPlugin({
  max,
  duration,
  throws = new TooManyRequestsError(),
}: RateLimitPluginProps) {
  return (app: Elysia) =>
    app.use(
      rateLimit({
        max,
        duration,
        errorResponse: throws,
        skip: () => env.NODE_ENV === "test",
        generator: async (req) => {
          const realIp = req.headers.get("x-real-ip");
          const authHeader = req.headers.get("authorization");
          const token = authHeader?.split(" ")[1]
            ? `jwt:${authHeader?.split(" ")[1]}`
            : null;
          return realIp || token || `anon:${req.headers.get("user-agent")}`;
        },
      }),
    );
}
