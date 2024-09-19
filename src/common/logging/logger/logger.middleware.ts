import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = uuidv4();
    const startTime = Date.now();

    req['traceId'] = traceId;

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.loggerService.log(
        `Request ${req.method} ${req.url} | TraceID: ${traceId} | Response Time: ${responseTime}ms`,
      );
    });

    next();
  }
}
