import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class NotAcceptableError extends AppError {
  constructor(message?: string) {
    super(message ?? "Not Acceptable", HTTP_CODE.NOT_ACCEPTABLE);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Not Acceptable",
      message: this.message,
    };
  }
}

export const NotAcceptableErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.NOT_ACCEPTABLE),
  error: Type.Literal("Not Acceptable"),
  message: Type.String(),
});
