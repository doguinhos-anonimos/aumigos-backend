import { HTTP_CODE } from "@/constants/http-code";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { BaseExceptionHandler } from "../base/base-exception-handler";

export class TypeBoxExceptionHandler extends BaseExceptionHandler {
  handle(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void {
    const httpStatus = HTTP_CODE.BAD_REQUEST;
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
