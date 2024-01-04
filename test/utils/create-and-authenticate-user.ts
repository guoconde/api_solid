import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  isAdmin = false
) => {
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "jhondoe@example.com",
      password: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  await request(app.server).post("/users").send({
    name: "John Doe",
    email: "jhondoe@example.com",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "jhondoe@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token };
};
