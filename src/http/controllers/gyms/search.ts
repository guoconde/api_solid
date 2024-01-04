import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymUseCase } from "@/http/use-cases/factories/make-search-gym-use-case";

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const querySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page, query } = querySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymUseCase();

  const { gyms } = await searchGymUseCase.execute({ page, query });

  reply.status(200).send({ gyms });
};
