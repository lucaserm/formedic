import { AppError, type AppErrorInternalDetails } from "../app-error";

export class InternalServerError extends AppError {
  constructor(
    message = "Erro interno. Tente novamente mais tarde.",
    internalDetails?: AppErrorInternalDetails,
  ) {
    super(message, 500, undefined, internalDetails);
  }
}
