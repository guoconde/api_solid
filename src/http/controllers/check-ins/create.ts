import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/http/use-cases/factories/make-check-in-use-case";

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { sub } = request.user;

  const createCheckInUseCase = makeCheckInUseCase();

  await createCheckInUseCase.execute({
    userId: sub,
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  reply.status(201).send();
};
