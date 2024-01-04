import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "test/utils/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate check in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: "Academia do Zé",
        desc: "Academia do Zé mesmo",
        phone: "123456789",
        latitude: -23.123456,
        longitude: -46.123456,
      },
    });

    const user = await prisma.user.findFirstOrThrow();

    let checkIn = await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        userId: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
  });
});
