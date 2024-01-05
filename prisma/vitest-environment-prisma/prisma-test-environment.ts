import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import { execSync } from "node:child_process";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateDatabaseUrl = (schema: string) => {
  let url;
  if (!process.env.DATABASE_URL) {
    url = new URL("postgresql://postgres:postgres@localhost:5432/postgres");
  } else {
    url = new URL(process.env.DATABASE_URL);
  }

  console.log("DATABASE_URL", url.toString());

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
