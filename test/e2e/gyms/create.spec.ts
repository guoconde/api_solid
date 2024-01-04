import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "test/utils/create-and-authenticate-user";

describe("Create gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia do Zé",
        desc: "Academia do Zé mesmo",
        phone: "123456789",
        latitude: -23.123456,
        longitude: -46.123456,
      });

    expect(response.statusCode).toBe(201);
  });
});
