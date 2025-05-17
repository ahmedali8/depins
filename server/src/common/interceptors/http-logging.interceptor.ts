import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;

    this.logger.log(
      `📥 [${method}] ${url} - Request Body: ${JSON.stringify(body)} \n Request Headers: ${headers ? JSON.stringify(headers) : ''}`,
    );

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `📤 [${method}] ${url} - Response: ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
