export class UserNotFoundError extends Error {
  constructor(msg?: string) {
    super("Usuário não encontrado." || msg);
  }
}
