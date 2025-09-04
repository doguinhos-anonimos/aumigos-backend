import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message ?? "Bad Request", HTTP_CODE.BAD_REQUEST);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Bad Request",
      message: this.message,
    };
  }
}

export const BadRequestErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.BAD_REQUEST),
  error: Type.Literal("Bad Request"),
  message: Type.String(),
});
