import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsUseCase } from "@/http/use-cases/factories/make-fetch-nearby-gym-use-case";

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    page: z.coerce.number().min(1).default(1),
  });

  const {
    latitude: userLatitude,
    longitude: userLongitude,
    page,
  } = nearbyBodySchema.parse(request.query);

  const nearbyGymUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await nearbyGymUseCase.execute({
    userLatitude,
    userLongitude,
    page,
  });

  reply.status(200).send({ gyms });
};
