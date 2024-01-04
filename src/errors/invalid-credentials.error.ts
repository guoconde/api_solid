export class InvalidCredentialsError extends Error {
  constructor(msg?: string) {
    super("Email ou senha inválido." || msg);
  }
}
