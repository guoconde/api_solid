export class MaxCheckInsExceptedError extends Error {
  constructor(msg?: string) {
    super("Limite de check-in atingida" || msg);
  }
}
