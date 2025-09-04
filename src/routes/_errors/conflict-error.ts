import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class ConflictError extends AppError {
  constructor(message?: string) {
    super(message ?? "Conflict", HTTP_CODE.CONFLICT);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Conflict",
      message: this.message,
    };
  }
}

export const ConflictErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.CONFLICT),
  error: Type.Literal("Conflict"),
  message: Type.String(),
});
