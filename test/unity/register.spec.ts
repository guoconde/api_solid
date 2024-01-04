import { RegisterUseCase } from "@/http/use-cases/register";
import { compare } from "bcryptjs";
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";
import { EmailAlreadyExistsError } from "@/errors/email-already-exists.error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should register a new user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jhondoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jhondoe@exemplo.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not allow two users with the same email", async () => {
    const email = "jhondoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
