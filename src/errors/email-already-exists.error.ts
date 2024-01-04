export class EmailAlreadyExistsError extends Error {
  constructor(msg?: string) {
    super("Email já cadastrado" || msg);
  }
}
