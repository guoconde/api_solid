import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate an user", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "jhondoe@example.com",
      password: "123456",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "jhondoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
