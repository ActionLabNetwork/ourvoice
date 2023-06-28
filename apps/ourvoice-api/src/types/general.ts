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
