import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class InternalServerError extends AppError {
  constructor(message?: string) {
    super(message ?? "Internal Server Error", HTTP_CODE.INTERNAL_SERVER_ERROR);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Internal Server Error",
      message: this.message,
    };
  }
}

export const InternalServerErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.INTERNAL_SERVER_ERROR),
  error: Type.Literal("Internal Server Error"),
  message: Type.String(),
});
