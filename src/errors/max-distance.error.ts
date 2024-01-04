export class MaxDistanceError extends Error {
  constructor(msg?: string) {
    super("Academia acima da distância permitida." || msg);
  }
}
