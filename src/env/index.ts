import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  POSTGRESQL_USERNAME: z.string(),
  POSTGRESQL_DATABASE: z.string(),
  POSTGRESQL_PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Environment errors: ", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
