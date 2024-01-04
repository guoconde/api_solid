import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "test/repositories/in-memory-check-ins-repository";
import { CheckInUseCase } from "@/http/use-cases/check-in";
import { InMemoryGymsRepository } from "test/repositories/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxCheckInsExceptedError } from "@/errors/max-check-ins-excepted";
import { MaxDistanceError } from "@/errors/max-distance.error";

let checkInRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in use-case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);

    await gymRepository.create({
      id: "gym-id-01",
      title: "Academia 01",
      latitude: -16.6926552,
      longitude: -49.2942842,
      desc: "Academia",
      phone: "62999999999",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id-01",
      gymId: "gym-id-01",
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0));

    await sut.execute({
      userId: "user-id-01",
      gymId: "gym-id-01",
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id-01",
        gymId: "gym-id-01",
        userLatitude: -16.6926552,
        userLongitude: -49.2942842,
      })
    ).rejects.toBeInstanceOf(MaxCheckInsExceptedError);
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 2, 8, 0, 0));

    await sut.execute({
      userId: "user-id-01",
      gymId: "gym-id-01",
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
    });

    vi.setSystemTime(new Date(2024, 0, 3, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id-01",
      gymId: "gym-id-01",
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymRepository.gyms.push({
      id: "gym-id-02",
      title: "Academia 01",
      latitude: new Decimal(-16.6528596),
      longitude: new Decimal(-49.1637786),
      desc: "Academia",
      phone: "62999999999",
    });

    await expect(() =>
      sut.execute({
        userId: "user-id-01",
        gymId: "gym-id-02",
        userLatitude: -16.6926552,
        userLongitude: -49.2942842,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

// -16.6528596,-49.1637786
// -16.6906821,-49.2806371 perto
