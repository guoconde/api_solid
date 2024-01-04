import { hash } from "bcryptjs";
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import { AuthenticateUseCase } from "@/http/use-cases/authenticate";
import { InvalidCredentialsError } from "@/errors/invalid-credentials.error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should authenticate an user", async () => {
    const hashPassword = await hash("123456", 6);

    await usersRepository.create({
      name: "John Doe",
      email: "jhondoe@example.com",
      password: hashPassword,
    });

    const { user } = await sut.execute({
      email: "jhondoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "jhondoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const hashPassword = await hash("123123", 6);

    await usersRepository.create({
      name: "John Doe",
      email: "jhondoe@example.com",
      password: hashPassword,
    });

    await expect(() =>
      sut.execute({
        email: "jhondoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
