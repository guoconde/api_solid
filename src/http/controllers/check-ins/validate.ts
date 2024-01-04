import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateCheckInUseCase } from "@/http/use-cases/factories/make-validate-check-in-use-case";

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const validateCheckInParamschema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamschema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId,
  });

  reply.status(204).send();
};
