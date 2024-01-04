import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import { execSync } from "node:child_process";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid"

const prisma = new PrismaClient();

const generateDatabaseUrl = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
};

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  setup: async () => {
    const schema = randomUUID();
    const databaseURL = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync(`npx prisma migrate deploy`);

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};
