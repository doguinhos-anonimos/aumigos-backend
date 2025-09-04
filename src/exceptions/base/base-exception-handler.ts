import { env } from "@/env";

import { ExceptionResponseProtocol } from "../protocols/exception-response-protocol";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export abstract class BaseExceptionHandler {
  protected abstract handle(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void;

  protected createErrorResponse(
    error: FastifyError,
    request: FastifyRequest,
    statusCode: number,
    requestId?: string,
    detailsArg?: any
  ): ExceptionResponseProtocol {
    const errorName = error?.name || "Error";
    const message = error?.message || "Erro interno do servidor";
    const path = request?.url || request?.raw?.url || "unknown";
    const timestamp = new Date().toISOString();
    const details = this.isProduction() ? undefined : detailsArg;

    return {
      error: errorName,
      statusCode,
      message,
      path,
      timestamp,
      requestId,
      details,
    };
  }

  // TODO: implementar lib de logger
  protected logError(
    error: FastifyError,
    errorResponse: ExceptionResponseProtocol,
    requestId: string
  ): void {
    if (this.isProduction()) return;
    const logData = {
      error: { name: error.name, message: error.message, stack: error.stack },
      response: errorResponse,
    };

    console.error(`[${requestId}]`, logData);
  }

  protected getRequestId(request?: FastifyRequest): string {
    return (
      (request?.headers?.["x-request-id"] as string) || this.generateRequestId()
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected isProduction(): boolean {
    return env.NODE_ENV === "production";
  }

  protected sanitizeErrorForProduction(error: any): any {
    if (this.isProduction()) {
      const { stack, ...sanitized } = error;
      return sanitized;
    }
    return error;
  }
}
