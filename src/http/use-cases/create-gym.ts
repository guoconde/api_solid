import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface CreateGymInputDto {
  title: string;
  desc: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    desc,
    phone,
    latitude,
    longitude,
  }: CreateGymInputDto): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      desc,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
