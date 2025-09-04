import { HTTP_CODE } from "@/constants/http-code";
import { Type } from "@sinclair/typebox";

import { AppError } from "./app-error";

import type { FastifyReply, FastifyRequest } from "fastify";
export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message ?? "Forbidden", HTTP_CODE.FORBIDDEN);
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      error: "Forbidden",
      message: this.message,
    };
  }
}

export function clearAllCookies(reply: FastifyReply, request: FastifyRequest) {
  const names = Object.keys(request.cookies ?? {});
  for (const name of names) {
    reply.clearCookie(name, { path: "/" });
  }
}

export const ForbiddenErrorSchema = Type.Object({
  statusCode: Type.Literal(HTTP_CODE.FORBIDDEN),
  error: Type.Literal("Forbidden"),
  message: Type.String(),
});
