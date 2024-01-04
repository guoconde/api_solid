import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsInputDto {
  userLatitude: number;
  userLongitude: number;
  page: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsInputDto): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page,
    });

    return { gyms };
  }
}
