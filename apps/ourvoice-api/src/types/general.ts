export type Edge<T> = { node: T; cursor: string };

export type GetManyResponse<T> = {
  totalCount: number;
  edges: Edge<T>[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
  };
};

export type GetManyRepositoryResponse<K extends string, T> = {
  totalCount: number;
} & { [P in K]: T[] };

export type ModerationPublishFrequency = {
  unit: 'minutes' | 'hours' | 'days';
  value: number;
};

export type AuthRoles = 'super' | 'admin' | 'moderator' | 'user';
