import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from 'src/common/logging/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = request['traceId'];
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`Request handled in ${Date.now() - now}ms | TraceID: ${traceId}`),
        ),
      );
  }
}
