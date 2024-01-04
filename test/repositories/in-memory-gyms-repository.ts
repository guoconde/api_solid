import {
  FetchNearbyGymsParams,
  GymsRepository,
} from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "node:crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      desc: data.desc ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(String(data.latitude)),
      longitude: new Decimal(String(data.longitude)),
      createdAt: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);

    return gyms;
  }

  async findManyNearby(params: FetchNearbyGymsParams): Promise<Gym[]> {
    const gyms = this.gyms
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
        );

        return distance < 10;
      })
      .slice((params.page - 1) * 20, params.page * 20);

    return gyms;
  }
}
