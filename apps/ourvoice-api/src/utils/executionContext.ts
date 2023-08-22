import { ContextType, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getRequest(context: ExecutionContext) {
  if (context.getType<ContextType | 'graphql'>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }
  return context.switchToHttp().getRequest();
}

export function getResponse(context: ExecutionContext) {
  if (context.getType<ContextType | 'graphql'>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().res;
  }
  return context.switchToHttp().getResponse();
}
