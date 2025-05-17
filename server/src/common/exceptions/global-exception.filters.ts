import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = host.switchToHttp().getRequest();
    const { method, url, body, headers } = request;

    // Default error structure
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      // NestJS HTTP Exception
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = (responseBody as any).message || exception.message;
      errorCode = (responseBody as any).errorCode || errorCode;
    } else if (exception instanceof Error) {
      // Other unhandled exceptions
      message = exception.message;
      errorCode = 'UNHANDLED_ERROR';
    }

    // Log full error details in the backend
    this.logger.error(
      `❌ [$${method}] ${url} - Request Body: ${JSON.stringify(body)} \n Request Headers: ${headers ? JSON.stringify(headers) : ''}`,
    );
    this.logger.error(`❌ [${status}] ${message}`, (exception as any)?.stack);

    // Send structured error response
    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
