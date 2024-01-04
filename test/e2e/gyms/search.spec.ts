import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "test/utils/create-and-authenticate-user";

describe("Search gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia do Zé",
        desc: "Academia do Zé mesmo",
        phone: "123456789",
        latitude: -23.123456,
        longitude: -46.123456,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia da Maria",
        desc: null,
        phone: "123456789",
        latitude: -23.123456,
        longitude: -46.123456,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ query: "Maria" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Academia da Maria",
      }),
    ]);
  });
});
