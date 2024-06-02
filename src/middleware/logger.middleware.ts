import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Request... ${req.method} ${req.originalUrl} by ${req.headers['x-api-key']} at ${new Date().toISOString()}`,
    );
    next();
  }
}
