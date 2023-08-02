import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnalyticsRepository } from './analytics.repository';
import { getRequest } from 'src/utils/executionContext';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private readonly repository: AnalyticsRepository) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = getRequest(context);
    const body = req.body;
    await this.repository.createApiCallRecord({
      data: {
        userHash: req.session.userId ?? null,
        endpoint: req.path,
        action: body?.operationName ?? null,
        data: {
          query: body?.query,
          variables: body?.variables,
          params: req.params,
        },
      },
    });
    return next.handle();
  }
}
