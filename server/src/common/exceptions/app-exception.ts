import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, errorCode }, statusCode);
  }
}
