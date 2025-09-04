import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message ?? "Unauthorized", HTTP_CODE.UNAUTHORIZED);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Unauthorized",
      message: this.message,
    };
  }
}

export const UnauthorizedErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.UNAUTHORIZED),
  error: Type.Literal("Unauthorized"),
  message: Type.String(),
});
