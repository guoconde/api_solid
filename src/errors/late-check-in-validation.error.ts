export class LateCheckInValidationError extends Error {
  constructor(msg?: string) {
    super(
      "O check não pode ser validado após 20 minutos de sua criação" || msg
    );
  }
}
