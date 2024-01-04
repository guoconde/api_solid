import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/http/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = querySchema.parse(request.query);
  const { sub } = request.user;

  const searchGymUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await searchGymUseCase.execute({
    userId: sub,
    page,
  });

  reply.status(200).send({ checkIns });
};
