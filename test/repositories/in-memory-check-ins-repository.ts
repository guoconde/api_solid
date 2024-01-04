import { CheckInRepository } from "@/repositories/check-ins-repository";
import { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      createdAt: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id);

    if (!checkIn) return null;

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const sartOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt);
      const isSameDay =
        checkInDate.isAfter(sartOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.userId === userId && isSameDay;
    });

    if (!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIn = this.checkIns
      .filter((checkIn) => checkIn.userId === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIn;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = this.checkIns.filter(
      (checkIn) => checkIn.userId === userId
    ).length;

    return count;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.checkIns.findIndex((c) => c.id === checkIn.id);

    if (index >= 0) {
      this.checkIns[index] = checkIn;
    }

    return checkIn;
  }
}
