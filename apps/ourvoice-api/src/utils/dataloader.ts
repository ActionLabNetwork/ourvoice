import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';

export const GqlContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return GqlExecutionContext.create(ctx);
  },
);

const KEY_DATALOADERS = 'dataloaders';

export function useDataloader<T, S>(
  context: GqlExecutionContext,
  dataloaderName: string,
  mapFn: (keys: T[]) => Promise<S[]>,
): DataLoader<T, S> {
  const ctx = context.getContext();
  if (!ctx[KEY_DATALOADERS]) {
    ctx[KEY_DATALOADERS] = {};
  }
  const dataloaders = ctx[KEY_DATALOADERS];
  if (!dataloaders[dataloaderName]) {
    dataloaders[dataloaderName] = new DataLoader<T, S>(mapFn);
  }
  return dataloaders[dataloaderName];
}
