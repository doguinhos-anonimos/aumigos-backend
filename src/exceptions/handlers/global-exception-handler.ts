import { HTTP_CODE } from "@/constants/http-code";
import { AppError } from "@/routes/_errors/app-error";
import { ForbiddenError } from "@/routes/_errors/forbidden-error";
import { UnauthorizedError } from "@/routes/_errors/unauthorized-error";
import { TypeBoxError } from "@sinclair/typebox";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { BaseExceptionHandler } from "../base/base-exception-handler";
import { AppExceptionHandler } from "./app-exception-handler";
import { TypeBoxExceptionHandler } from "./type-box-exception-handler";

export class GlobalExceptionHandler extends BaseExceptionHandler {
  constructor(
    private readonly appExceptionHandler: AppExceptionHandler,
    private readonly typeBoxExceptionHandler: TypeBoxExceptionHandler
  ) {
    super();
  }

  handle(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void {
    if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
      const cookieNames = Object.keys(request.cookies ?? {});
      for (const name of cookieNames) {
        reply.clearCookie(name, { path: "/" });
      }
    }
    if (error as TypeBoxError) {
      return this.typeBoxExceptionHandler.handle(error, request, reply);
    }
    if (error instanceof AppError) {
      return this.appExceptionHandler.handle(error, request, reply);
    }

    return this.handleUnknownError(error, request, reply);
  }

  private handleUnknownError(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void {
    error.message = "Erro interno do servidor";
    const httpStatus = HTTP_CODE.INTERNAL_SERVER_ERROR;
    const requestId = this.getRequestId(request);
    const details = { stack: error.stack, originalError: error.name };

    const errorResponse = this.createErrorResponse(
      error,
      request,
      httpStatus,
      requestId,
      details
    );
    if (httpStatus >= HTTP_CODE.INTERNAL_SERVER_ERROR)
      this.logError(error, errorResponse, requestId);
    reply.status(httpStatus).send(errorResponse);
  }
}
