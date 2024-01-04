import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { EmailAlreadyExistsError } from "@/errors/email-already-exists.error";
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ name, email, password });

    reply.status(201).send();
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        error: error.message,
      });
    }

    throw error;
  }
};
