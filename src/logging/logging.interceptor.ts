import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();
    const { method, originalUrl, body, headers } = request;

    // Mask sensitive data in request body
    const maskedBody = this.maskSensitiveData(body);

    // Log the incoming request
    this.logger.log(
      `Incoming Request: ${method} ${originalUrl}`,
      'HTTP',
      {
        method,
        url: originalUrl,
        body: maskedBody,
        headers: this.filterHeaders(headers),
        ip: request.ip,
      }
    );

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const responseTime = Date.now() - startTime;
          
          // Mask sensitive data in response
          const maskedResponse = this.maskSensitiveData(data);

          // Log the response
          this.logger.log(
            `Response: ${method} ${originalUrl} ${response.statusCode} ${responseTime}ms`,
            'HTTP',
            {
              method,
              url: originalUrl,
              statusCode: response.statusCode,
              responseTime,
              response: maskedResponse,
            }
          );
        },
        error: (error: any) => {
          const responseTime = Date.now() - startTime;
          
          this.logger.error(
            `Error Response: ${method} ${originalUrl} ${error.status || 500} ${responseTime}ms`,
            error.stack,
            'HTTP',
            {
              method,
              url: originalUrl,
              statusCode: error.status || 500,
              responseTime,
              error: {
                message: error.message,
                code: error.code,
                status: error.status,
              },
            }
          );
        },
      }),
    );
  }

  private maskSensitiveData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'authorization', 'credit_card'];
    const masked = { ...data };

    Object.keys(masked).forEach(key => {
      if (sensitiveFields.includes(key.toLowerCase())) {
        masked[key] = '***MASKED***';
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    });

    return masked;
  }

  private filterHeaders(headers: any): any {
    const filtered = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-auth-token'];
    
    sensitiveHeaders.forEach(header => {
      if (filtered[header]) {
        filtered[header] = '***MASKED***';
      }
    });

    return filtered;
  }
} 