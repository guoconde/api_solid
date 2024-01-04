import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "test/utils/create-and-authenticate-user";

describe("Nearby gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search a nearby gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia Perto",
        latitude: -16.6926552,
        longitude: -49.2942842,
        desc: "Academia",
        phone: "62999999999",
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Academia TS",
        desc: "Academia de musculação",
        phone: "123456789",
        latitude: 0,
        longitude: 0,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -16.6926552, longitude: -49.2942842, page: 1 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Academia Perto",
      }),
    ]);
  });
});
