import { AppError } from "../app-error";

export class TooManyRequestsError extends AppError {
  constructor(message = "Muitas requisições. Tente novamente em 1 minuto.") {
    super(message, 429);
  }
}
