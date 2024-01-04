export class CheckInNotFoundError extends Error {
  constructor(msg?: string) {
    super("Check in não encontrado." || msg);
  }
}
