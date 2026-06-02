import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        console.error('REAL ERROR', error);
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const response = error.getResponse() as {
            message?: string | string[];
          };

          if (Array.isArray(response.message)) {
            message = response.message[0];
          } else {
            message = response.message || error.message;
          }
        }

        return throwError(
          () =>
            new HttpException(
              {
                success: false,
                statusCode: statusCode,
                message: message,
                timestamp: new Date().toISOString(),
              },
              statusCode,
            ),
        );
      }),
    );
  }
}
