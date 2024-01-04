import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "@/errors/invalid-credentials.error";
import { makeGetUserProfileUseCase } from "../../use-cases/factories/make-get-user-profile-use-case";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const { sub } = request.user;

  const getUserProfile = makeGetUserProfileUseCase();

  try {
    const { user } = await getUserProfile.execute({ userId: sub });

    reply.status(200).send({
      user: { ...user, password: undefined },
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        error: error.message,
      });
    }

    throw error;
  }
};
