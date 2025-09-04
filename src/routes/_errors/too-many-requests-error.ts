import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class TooManyRequestsError extends AppError {
  constructor(message?: string) {
    super(message ?? "Too Many Requests", HTTP_CODE.TOO_MANY_REQUESTS);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Too Many Requests",
      message: this.message,
    };
  }
}

export const TooManyRequestsErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.TOO_MANY_REQUESTS),
  error: Type.Literal("Too Many Requests"),
  message: Type.String(),
});
