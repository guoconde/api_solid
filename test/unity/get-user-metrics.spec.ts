import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "test/repositories/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "@/http/use-cases/get-user-metrics";

let checkInRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user check in metrics use-case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it("should be able to count check in from metrics", async () => {
    await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-01",
    });

    await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-02",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
