import { FastifyInstance } from "fastify";
import { register } from "../controllers/users/register";
import { authenticate } from "../controllers/users/autenticate";
import { profile } from "../controllers/users/profile";
import { verifyJWT } from "../middlewares/verify-jwt";
import { refresh } from "../controllers/users/refresh";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  app.get("/me", { onRequest: [verifyJWT] }, profile);
};
