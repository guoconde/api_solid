import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "test/repositories/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "@/http/use-cases/fetch-nearby-gyms";

let gymInRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use-case", () => {
  beforeEach(async () => {
    gymInRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymInRepository);
  });

  it("should be able to search gym", async () => {
    await gymInRepository.create({
      title: "Academia 01",
      latitude: -16.6926552,
      longitude: -49.2942842,
      desc: "Academia",
      phone: "62999999999",
    });

    await gymInRepository.create({
      title: "Academia TS",
      desc: "Academia de musculação",
      phone: "123456789",
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining("01") }),
    ]);
  });

  it("should be able to fetch pagineted gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymInRepository.create({
        title: `Academia ${i}`,
        desc: "Academia de musculação",
        phone: "123456789",
        latitude: -16.6926552,
        longitude: -49.2942842,
      });
    }

    const { gyms } = await sut.execute({
      userLatitude: -16.6926552,
      userLongitude: -49.2942842,
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining("21") }),
      expect.objectContaining({ title: expect.stringContaining("22") }),
    ]);
  });
});
