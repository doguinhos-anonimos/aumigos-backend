import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message ?? "Not Found", HTTP_CODE.NOT_FOUND);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Not Found",
      message: this.message,
    };
  }
}

export const NotFoundErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.NOT_FOUND),
  error: Type.Literal("Not Found"),
  message: Type.String(),
});
