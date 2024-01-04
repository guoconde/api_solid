import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "test/repositories/in-memory-gyms-repository";
import { CreateGymUseCase } from "@/http/use-cases/create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register use-case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should register a new user", async () => {
    const { gym } = await sut.execute({
      title: "Academia",
      desc: "Academia de musculação",
      phone: "123456789",
      latitude: 0,
      longitude: 0,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
