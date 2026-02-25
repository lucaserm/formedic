import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).catch("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  WEB_URL: z.url(),
  MAX_REQUESTS_PER_MINUTE: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(100)
    .transform((v) => v || Infinity),
  DATABASE_AUTO_MIGRATION: z
    .string()
    .toLowerCase()
    .default("true")
    .transform((v) => v === "true"),
});

export const env = envSchema.parse(process.env);
