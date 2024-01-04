import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/http/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { makeGetUserMetricsUseCase } from "@/http/use-cases/factories/make-get-user-metrics-use-case";

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user;

  const searchGymUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await searchGymUseCase.execute({
    userId: sub,
  });

  reply.status(200).send({ checkInsCount });
};
