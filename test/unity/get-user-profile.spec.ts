import { hash } from "bcryptjs";
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import { GetUserProfileUseCase } from "@/http/use-cases/get-user-profile";
import { UserNotFoundError } from "@/errors/user-not-found.error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const hashPassword = await hash("123456", 6);

    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "jhondoe@example.com",
      password: hashPassword,
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "invalid-id",
      })
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
