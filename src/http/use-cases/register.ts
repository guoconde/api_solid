import { EmailAlreadyExistsError } from "@/errors/email-already-exists.error";
import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";

interface RgisterInputDto {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RgisterInputDto): Promise<RegisterUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return { user };
  }
}
