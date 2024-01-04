import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "test/repositories/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "@/http/use-cases/fetch-user-check-ins-history";

let checkInRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch user check in history use-case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it("should be able to fetch check in history", async () => {
    await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-01",
    });

    await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-02",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-id-01" }),
      expect.objectContaining({ gymId: "gym-id-02" }),
    ]);
  });

  it("should be able to fetch pagineted check in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        userId: "user-id-01",
        gymId: `gym-id-${i}`,
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: "gym-id-21" }),
      expect.objectContaining({ gymId: "gym-id-22" }),
    ]);
  });
});
