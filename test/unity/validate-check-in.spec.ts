import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "test/repositories/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "@/http/use-cases/validate-check-in";
import { CheckInNotFoundError } from "@/errors/check-in-not-found.error";
import { LateCheckInValidationError } from "@/errors/late-check-in-validation.error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate check in use-case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check in", async () => {
    const createdCheckIn = await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validatedAt).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(CheckInNotFoundError);
  });

  it("should not be able to validate the check in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40, 0));

    const createdCheckIn = await checkInRepository.create({
      userId: "user-id-01",
      gymId: "gym-id-01",
    });

    const TWENTY_ONE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 21;

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MILLISECONDS);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
