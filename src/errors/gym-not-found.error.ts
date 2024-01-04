export class GymNotFoundError extends Error {
  constructor(msg?: string) {
    super("Academia não encontrada." || msg);
  }
}
