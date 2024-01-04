import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "test/repositories/in-memory-gyms-repository";
import { SearchGymUseCase } from "@/http/use-cases/search-gym";

let gymInRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search gym use-case", () => {
  beforeEach(async () => {
    gymInRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymInRepository);
  });

  it("should be able to search gym", async () => {
    await gymInRepository.create({
      title: "Academia JS",
      desc: "Academia de musculação",
      phone: "123456789",
      latitude: 0,
      longitude: 0,
    });

    await gymInRepository.create({
      title: "Academia TS",
      desc: "Academia de musculação",
      phone: "123456789",
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: "Academia",
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining("Academia") }),
      expect.objectContaining({ title: expect.stringContaining("Academia") }),
    ]);
  });

  it("should be able to fetch pagineted gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymInRepository.create({
        title: `Academia ${i}`,
        desc: "Academia de musculação",
        phone: "123456789",
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({
      query: "Academia",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: expect.stringContaining("21") }),
      expect.objectContaining({ title: expect.stringContaining("22") }),
    ]);
  });
});
