import { GymNotFoundError } from "@/errors/gym-not-found.error";
import { MaxCheckInsExceptedError } from "@/errors/max-check-ins-excepted";
import { MaxDistanceError } from "@/errors/max-distance.error";
import { CheckInRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { CheckIn } from "@prisma/client";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new GymNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
    );

    const MAX_DISTANCE_IN_KILOMETER = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETER) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new MaxCheckInsExceptedError();
    }

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    });

    return {
      checkIn,
    };
  }
}
