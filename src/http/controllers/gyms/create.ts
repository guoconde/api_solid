import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymUseCase } from "@/http/use-cases/factories/make-create-gym-use-case";

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    desc: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { desc, latitude, longitude, phone, title } = createGymBodySchema.parse(
    request.body
  );

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({ desc, latitude, longitude, phone, title });

  reply.status(201).send();
};
