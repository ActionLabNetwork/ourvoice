/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type BasePoll = {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  postLink: Maybe<Scalars['String']['output']>;
  published: Scalars['Boolean']['output'];
  question: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type BasePollOption = {
  id: Scalars['Int']['output'];
  option: Scalars['String']['output'];
};

export type CategoriesFilterInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  disabledAfter?: InputMaybe<Scalars['DateTime']['input']>;
  disabledBefore?: InputMaybe<Scalars['DateTime']['input']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type Category = {
  __typename?: 'Category';
  active: Scalars['Boolean']['output'];
  children: Maybe<Array<Category>>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  description: Maybe<Scalars['String']['output']>;
  disabledAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parent: Maybe<Category>;
  posts: Maybe<Array<Post>>;
  weight: Scalars['Int']['output'];
};

export type CategoryConnection = {
  __typename?: 'CategoryConnection';
  edges: Array<CategoryEdge>;
  pageInfo: CategoryPageInfo;
};

export type CategoryCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  cursor: Scalars['String']['output'];
  node: Category;
};

export type CategoryPageInfo = {
  __typename?: 'CategoryPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type CategoryPaginationInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
};

export type Comment = {
  __typename?: 'Comment';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  children: Array<Comment>;
  content: Scalars['String']['output'];
  createdAt: Maybe<Scalars['DateTime']['output']>;
  disabledAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  moderated: Scalars['Boolean']['output'];
  moderatedAt: Maybe<Scalars['DateTime']['output']>;
  parent: Maybe<Comment>;
  post: Maybe<Post>;
  published: Scalars['Boolean']['output'];
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  votes: Array<Vote>;
  votesDown: Maybe<Scalars['Int']['output']>;
  votesUp: Maybe<Scalars['Int']['output']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Maybe<Array<Maybe<CommentEdge>>>;
  pageInfo: CommentPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type CommentCreateInput = {
  authorHash: Scalars['String']['input'];
  authorNickname: Scalars['String']['input'];
  content: Scalars['String']['input'];
  moderated?: InputMaybe<Scalars['Boolean']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  node: Comment;
};

export type CommentModeration = {
  __typename?: 'CommentModeration';
  commentVersion: ModerationCommentVersion;
  decision: ModerationDecision;
  id: Scalars['Int']['output'];
  moderatorHash: Scalars['String']['output'];
  moderatorNickname: Scalars['String']['output'];
  reason: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
};

export type CommentPageInfo = {
  __typename?: 'CommentPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type CommentPaginationInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type CommentUpdateInput = {
  authorHash?: InputMaybe<Scalars['String']['input']>;
  authorNickname?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  moderated?: InputMaybe<Scalars['Boolean']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CommentsFilterInput = {
  authorHash?: InputMaybe<Scalars['String']['input']>;
  authorNickname?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  disabledAfter?: InputMaybe<Scalars['DateTime']['input']>;
  disabledBefore?: InputMaybe<Scalars['DateTime']['input']>;
  moderated?: InputMaybe<Scalars['Boolean']['input']>;
  moderatedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  moderatedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  parentId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  publishedBefore?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ContactFormEntryCreateInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  recaptchaToken: Scalars['String']['input'];
};

export type ModerationComment = {
  __typename?: 'ModerationComment';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  children: Array<ModerationComment>;
  id: Scalars['Int']['output'];
  parent: Maybe<ModerationComment>;
  parentId: Maybe<Scalars['Int']['output']>;
  post: Maybe<ModerationPost>;
  requiredModerations: Scalars['Int']['output'];
  status: ModerationCommentStatus;
  timestamp: Scalars['String']['output'];
  versions: Array<ModerationCommentVersion>;
};

export type ModerationCommentConnection = {
  __typename?: 'ModerationCommentConnection';
  edges: Maybe<Array<Maybe<ModerationCommentEdge>>>;
  pageInfo: ModerationCommentPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type ModerationCommentCreateInput = {
  authorHash: Scalars['String']['input'];
  authorNickname: Scalars['String']['input'];
  content: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  requiredModerations: Scalars['Int']['input'];
};

export type ModerationCommentEdge = {
  __typename?: 'ModerationCommentEdge';
  cursor: Scalars['String']['output'];
  node: ModerationComment;
};

export type ModerationCommentModifyInput = {
  content?: InputMaybe<Scalars['String']['input']>;
};

export type ModerationCommentPageInfo = {
  __typename?: 'ModerationCommentPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type ModerationCommentPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export enum ModerationCommentStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ModerationCommentVersion = {
  __typename?: 'ModerationCommentVersion';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  comment: ModerationComment;
  content: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  latest: Scalars['Boolean']['output'];
  moderations: Array<CommentModeration>;
  reason: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type ModerationCommentsFilterInput = {
  status?: InputMaybe<ModerationCommentStatus>;
};

export enum ModerationDecision {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED'
}

export type ModerationPost = {
  __typename?: 'ModerationPost';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  comments: Array<ModerationComment>;
  id: Scalars['Int']['output'];
  requiredModerations: Scalars['Int']['output'];
  status: ModerationPostStatus;
  versions: Array<ModerationPostVersion>;
};

export type ModerationPostConnection = {
  __typename?: 'ModerationPostConnection';
  edges: Maybe<Array<Maybe<ModerationPostEdge>>>;
  pageInfo: ModerationPostPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type ModerationPostCreateInput = {
  authorHash: Scalars['String']['input'];
  authorNickname: Scalars['String']['input'];
  categoryIds: Array<Scalars['Int']['input']>;
  content: Scalars['String']['input'];
  files?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  requiredModerations: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type ModerationPostEdge = {
  __typename?: 'ModerationPostEdge';
  cursor: Scalars['String']['output'];
  node: ModerationPost;
};

export type ModerationPostModifyInput = {
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ModerationPostPageInfo = {
  __typename?: 'ModerationPostPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type ModerationPostPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export enum ModerationPostStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ModerationPostVersion = {
  __typename?: 'ModerationPostVersion';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  categoryIds: Array<Scalars['Int']['output']>;
  content: Scalars['String']['output'];
  files: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['Int']['output'];
  latest: Scalars['Boolean']['output'];
  moderations: Maybe<Array<PostModeration>>;
  post: ModerationPost;
  reason: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  title: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type ModerationPostsFilterInput = {
  status?: InputMaybe<ModerationPostStatus>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']['output']>;
  approveModerationCommentVersion: Maybe<ModerationComment>;
  approveModerationPostVersion: Maybe<ModerationPost>;
  createCategory: Category;
  createComment: Comment;
  createContactFormEntry: Scalars['String']['output'];
  createModerationComment: Maybe<ModerationComment>;
  createModerationPost: Maybe<ModerationPost>;
  createPoll: Maybe<Poll>;
  createUser: User;
  createVote: Vote;
  deleteCategory: Category;
  deleteComment: Comment;
  deletePost: Post;
  deleteUser: User;
  deleteVote: Vote;
  modifyModerationComment: Maybe<ModerationComment>;
  modifyModerationPost: Maybe<ModerationPost>;
  rejectModerationCommentVersion: Maybe<ModerationComment>;
  rejectModerationPostVersion: Maybe<ModerationPost>;
  removePoll: Scalars['Int']['output'];
  renewCommentModeration: Maybe<ModerationComment>;
  renewPostModeration: Maybe<ModerationPost>;
  rollbackModifiedModerationComment: Maybe<ModerationComment>;
  rollbackModifiedModerationPost: Maybe<ModerationPost>;
  updateCategory: Category;
  updateComment: Comment;
  updatePoll: Maybe<Poll>;
  updateUser: User;
  votePoll: Maybe<VoteResponse>;
};


export type MutationApproveModerationCommentVersionArgs = {
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationApproveModerationPostVersionArgs = {
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreateCommentArgs = {
  data: CommentCreateInput;
};


export type MutationCreateContactFormEntryArgs = {
  data: ContactFormEntryCreateInput;
};


export type MutationCreateModerationCommentArgs = {
  data: ModerationCommentCreateInput;
};


export type MutationCreateModerationPostArgs = {
  data: ModerationPostCreateInput;
};


export type MutationCreatePollArgs = {
  data: PollCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateVoteArgs = {
  data: VoteCreateInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteVoteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationModifyModerationCommentArgs = {
  commentId: Scalars['Int']['input'];
  data: ModerationCommentModifyInput;
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationModifyModerationPostArgs = {
  data: ModerationPostModifyInput;
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  postId: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectModerationCommentVersionArgs = {
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectModerationPostVersionArgs = {
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRemovePollArgs = {
  pollId: Scalars['Int']['input'];
};


export type MutationRenewCommentModerationArgs = {
  commentModerationId: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
};


export type MutationRenewPostModerationArgs = {
  moderatorHash: Scalars['String']['input'];
  postModerationId: Scalars['Int']['input'];
};


export type MutationRollbackModifiedModerationCommentArgs = {
  commentId: Scalars['Int']['input'];
};


export type MutationRollbackModifiedModerationPostArgs = {
  postId: Scalars['Int']['input'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoryUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateCommentArgs = {
  data: CommentUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdatePollArgs = {
  data: PollUpdateInput;
  pollId: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  id: Scalars['Int']['input'];
};


export type MutationVotePollArgs = {
  voteInput?: InputMaybe<VoteInput>;
};

export type Poll = BasePoll & {
  __typename?: 'Poll';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  options: Array<PollOption>;
  postLink: Maybe<Scalars['String']['output']>;
  published: Scalars['Boolean']['output'];
  question: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type PollCreateInput = {
  active: Scalars['Boolean']['input'];
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  options: Array<PollOptionCreateInput>;
  postLink?: InputMaybe<Scalars['String']['input']>;
  published: Scalars['Boolean']['input'];
  question: Scalars['String']['input'];
  weight: Scalars['Int']['input'];
};

export type PollFilterInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAfter?: InputMaybe<Scalars['DateTime']['input']>;
  expiresBefore?: InputMaybe<Scalars['DateTime']['input']>;
  expiresExcludeNull?: InputMaybe<Scalars['Boolean']['input']>;
  postLink?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type PollOption = BasePollOption & {
  __typename?: 'PollOption';
  id: Scalars['Int']['output'];
  option: Scalars['String']['output'];
};

export type PollOptionCreateInput = {
  option: Scalars['String']['input'];
};

export type PollOptionStat = {
  __typename?: 'PollOptionStat';
  optionId: Scalars['Int']['output'];
  proportion: Scalars['Float']['output'];
};

export type PollOptionWithResult = BasePollOption & {
  __typename?: 'PollOptionWithResult';
  id: Scalars['Int']['output'];
  numVotes: Scalars['Int']['output'];
  option: Scalars['String']['output'];
};

export type PollPageInfo = {
  __typename?: 'PollPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PollPaginationInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type PollUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  options?: InputMaybe<Array<PollOptionCreateInput>>;
  postLink?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type PollWithResult = BasePoll & {
  __typename?: 'PollWithResult';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  options: Array<PollOptionWithResult>;
  postLink: Maybe<Scalars['String']['output']>;
  published: Scalars['Boolean']['output'];
  question: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type PollWithResultConnection = {
  __typename?: 'PollWithResultConnection';
  edges: Array<PollWithResultEdge>;
  pageInfo: PollPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type PollWithResultEdge = {
  __typename?: 'PollWithResultEdge';
  cursor: Scalars['String']['output'];
  node: PollWithResult;
};

export type PollWithStats = BasePoll & {
  __typename?: 'PollWithStats';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  options: Array<PollOption>;
  postLink: Maybe<Scalars['String']['output']>;
  published: Scalars['Boolean']['output'];
  question: Scalars['String']['output'];
  stats: Maybe<Array<PollOptionStat>>;
  weight: Scalars['Int']['output'];
};

export type PollWithStatsConnection = {
  __typename?: 'PollWithStatsConnection';
  edges: Array<PollWithStatsEdge>;
  pageInfo: PollPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type PollWithStatsEdge = {
  __typename?: 'PollWithStatsEdge';
  cursor: Scalars['String']['output'];
  node: PollWithStats;
};

export type Post = {
  __typename?: 'Post';
  authorHash: Maybe<Scalars['String']['output']>;
  authorNickname: Maybe<Scalars['String']['output']>;
  categories: Array<Category>;
  comments: Maybe<Array<Comment>>;
  content: Scalars['String']['output'];
  createdAt: Maybe<Scalars['DateTime']['output']>;
  disabledAt: Maybe<Scalars['DateTime']['output']>;
  files: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['Int']['output'];
  moderated: Scalars['Boolean']['output'];
  moderatedAt: Maybe<Scalars['DateTime']['output']>;
  published: Scalars['Boolean']['output'];
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  votes: Maybe<Array<Vote>>;
  votesDown: Scalars['Int']['output'];
  votesUp: Scalars['Int']['output'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Maybe<Array<Maybe<PostEdge>>>;
  pageInfo: PostPageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

export type PostModeration = {
  __typename?: 'PostModeration';
  decision: ModerationDecision;
  id: Scalars['Int']['output'];
  moderatorHash: Scalars['String']['output'];
  moderatorNickname: Scalars['String']['output'];
  postVersion: ModerationPostVersion;
  reason: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
};

export type PostPageInfo = {
  __typename?: 'PostPageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Maybe<Scalars['Boolean']['output']>;
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PostPaginationInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type PostSortingInput = {
  sortByCommentsCount?: InputMaybe<SortOrder>;
  sortByCreatedAt?: InputMaybe<SortOrder>;
  sortByModeratedAt?: InputMaybe<SortOrder>;
  sortByVotesDown?: InputMaybe<SortOrder>;
  sortByVotesUp?: InputMaybe<SortOrder>;
  sortBypublishedAt?: InputMaybe<SortOrder>;
};

export type PostUpdateInput = {
  authorHash?: InputMaybe<Scalars['String']['input']>;
  authorNickname?: InputMaybe<Scalars['String']['input']>;
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  moderated?: InputMaybe<Scalars['Boolean']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  votesDown?: InputMaybe<Scalars['Int']['input']>;
  votesUp?: InputMaybe<Scalars['Int']['input']>;
};

export type PostsFilterInput = {
  authorHash?: InputMaybe<Scalars['String']['input']>;
  authorNickname?: InputMaybe<Scalars['String']['input']>;
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  moderated?: InputMaybe<Scalars['Boolean']['input']>;
  moderatedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  moderatedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  publishedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  publishedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  votesDown?: InputMaybe<Scalars['Int']['input']>;
  votesUp?: InputMaybe<Scalars['Int']['input']>;
};

export type PresignedUrl = {
  __typename?: 'PresignedUrl';
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty: Maybe<Scalars['String']['output']>;
  availablePolls: Array<Poll>;
  categories: Maybe<CategoryConnection>;
  category: Maybe<Category>;
  comment: Maybe<Comment>;
  commentVersion: Maybe<ModerationCommentVersion>;
  comments: Maybe<CommentConnection>;
  getPresignedDownloadUrls: Array<PresignedUrl>;
  getPresignedUrls: Array<PresignedUrl>;
  moderationComment: Maybe<ModerationComment>;
  moderationComments: Maybe<ModerationCommentConnection>;
  moderationPost: Maybe<ModerationPost>;
  moderationPosts: Maybe<ModerationPostConnection>;
  pollsWithResult: Maybe<PollWithResultConnection>;
  post: Maybe<Post>;
  postVersion: Maybe<ModerationPostVersion>;
  posts: Maybe<PostConnection>;
  postsByCategories: Maybe<PostConnection>;
  user: Maybe<User>;
  users: Array<User>;
  vote: Maybe<Vote>;
  votedPolls: Maybe<PollWithStatsConnection>;
  votes: Array<Vote>;
};


export type QueryAvailablePollsArgs = {
  userHash: Scalars['String']['input'];
};


export type QueryCategoriesArgs = {
  filter?: InputMaybe<CategoriesFilterInput>;
  pagination?: InputMaybe<CategoryPaginationInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCommentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCommentVersionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCommentsArgs = {
  filter?: InputMaybe<CommentsFilterInput>;
  pagination?: InputMaybe<CommentPaginationInput>;
};


export type QueryGetPresignedDownloadUrlsArgs = {
  bucket: Scalars['String']['input'];
  expiresIn: Scalars['Int']['input'];
  keys: Array<Scalars['String']['input']>;
};


export type QueryGetPresignedUrlsArgs = {
  bucket: Scalars['String']['input'];
  expiresIn: Scalars['Int']['input'];
  keys: Array<Scalars['String']['input']>;
};


export type QueryModerationCommentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryModerationCommentsArgs = {
  filter?: InputMaybe<ModerationCommentsFilterInput>;
  pagination?: InputMaybe<ModerationCommentPaginationInput>;
};


export type QueryModerationPostArgs = {
  id: Scalars['Int']['input'];
};


export type QueryModerationPostsArgs = {
  filter?: InputMaybe<ModerationPostsFilterInput>;
  pagination?: InputMaybe<ModerationPostPaginationInput>;
};


export type QueryPollsWithResultArgs = {
  filter?: InputMaybe<PollFilterInput>;
  moderatorHash: Scalars['String']['input'];
  pagination?: InputMaybe<PollPaginationInput>;
};


export type QueryPostArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPostVersionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPostsArgs = {
  filter?: InputMaybe<PostsFilterInput>;
  pagination?: InputMaybe<PostPaginationInput>;
  sort?: InputMaybe<PostSortingInput>;
};


export type QueryPostsByCategoriesArgs = {
  categories: Array<Scalars['String']['input']>;
  filter?: InputMaybe<PostsFilterInput>;
  pagination?: InputMaybe<PostPaginationInput>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryVoteArgs = {
  id: Scalars['Int']['input'];
};


export type QueryVotedPollsArgs = {
  pagination?: InputMaybe<PollPaginationInput>;
  userHash: Scalars['String']['input'];
};


export type QueryVotesArgs = {
  filter?: InputMaybe<VotesFilterInput>;
};

export type User = {
  __typename?: 'User';
  active: Maybe<Scalars['Boolean']['output']>;
  comments: Array<Comment>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  disabledAt: Maybe<Scalars['DateTime']['output']>;
  hash: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  nickname: Maybe<Scalars['String']['output']>;
  orgId: Scalars['Int']['output'];
  posts: Array<Post>;
  title: Maybe<Scalars['String']['output']>;
  type: UserType;
  updatedAt: Maybe<Scalars['DateTime']['output']>;
  verifiedAt: Maybe<Scalars['DateTime']['output']>;
};

export type UserCreateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  disabledAt?: InputMaybe<Scalars['DateTime']['input']>;
  hash: Scalars['String']['input'];
  nickname?: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  typeId: Scalars['Int']['input'];
  verifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  users: Array<User>;
};

export type UserUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  disabledAt?: InputMaybe<Scalars['DateTime']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
  orgId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeId?: InputMaybe<Scalars['Int']['input']>;
  verifiedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Vote = {
  __typename?: 'Vote';
  authorHash: Scalars['String']['output'];
  authorNickname: Scalars['String']['output'];
  comment: Maybe<Comment>;
  id: Scalars['Int']['output'];
  post: Post;
  voteType: Scalars['String']['output'];
};

export type VoteCreateInput = {
  authorHash: Scalars['String']['input'];
  authorNickname: Scalars['String']['input'];
  commentId?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['Int']['input'];
  voteType: Scalars['String']['input'];
};

export type VoteInput = {
  optionId: Scalars['Int']['input'];
  pollId: Scalars['Int']['input'];
  voterHash: Scalars['String']['input'];
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  optionId: Scalars['Int']['output'];
  pollId: Scalars['Int']['output'];
  stats: Maybe<Array<PollOptionStat>>;
};

export type VotesFilterInput = {
  authorHash?: InputMaybe<Scalars['String']['input']>;
  authorNickname?: InputMaybe<Scalars['String']['input']>;
  commentId?: InputMaybe<Scalars['Int']['input']>;
  postId?: InputMaybe<Scalars['Int']['input']>;
  voteType?: InputMaybe<Scalars['String']['input']>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type ApproveModerationCommentVersionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type ApproveModerationCommentVersionMutation = { __typename?: 'Mutation', approveModerationCommentVersion: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'CommentModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> }> } | null };

export type ApproveModerationPostVersionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type ApproveModerationPostVersionMutation = { __typename?: 'Mutation', approveModerationPostVersion: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null };

export type CreateCommentMutationVariables = Exact<{
  data: CommentCreateInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: number, content: string, createdAt: any | null, post: { __typename?: 'Post', id: number, title: string } | null, parent: { __typename?: 'Comment', id: number, content: string } | null } };

export type CreateModerationCommentMutationVariables = Exact<{
  data: ModerationCommentCreateInput;
}>;


export type CreateModerationCommentMutation = { __typename?: 'Mutation', createModerationComment: { __typename?: 'ModerationComment', id: number, status: ModerationCommentStatus } | null };

export type CreateModerationPostMutationVariables = Exact<{
  data: ModerationPostCreateInput;
}>;


export type CreateModerationPostMutation = { __typename?: 'Mutation', createModerationPost: { __typename?: 'ModerationPost', id: number, status: ModerationPostStatus } | null };

export type CreateOrDeleteVoteMutationVariables = Exact<{
  data: VoteCreateInput;
}>;


export type CreateOrDeleteVoteMutation = { __typename?: 'Mutation', createVote: { __typename?: 'Vote', id: number, voteType: string, authorHash: string, authorNickname: string, post: { __typename?: 'Post', id: number }, comment: { __typename?: 'Comment', id: number } | null } };

export type DeleteCommentMutationVariables = Exact<{
  deleteCommentId: Scalars['Int']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'Comment', id: number, content: string, parent: { __typename?: 'Comment', id: number, content: string } | null, post: { __typename?: 'Post', id: number, title: string } | null } };

export type ModifyModerationCommentVersionMutationMutationVariables = Exact<{
  commentId: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  data: ModerationCommentModifyInput;
}>;


export type ModifyModerationCommentVersionMutationMutation = { __typename?: 'Mutation', modifyModerationComment: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'CommentModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> }> } | null };

export type ModifyModerationPostVersionMutationMutationVariables = Exact<{
  postId: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  data: ModerationPostModifyInput;
}>;


export type ModifyModerationPostVersionMutationMutation = { __typename?: 'Mutation', modifyModerationPost: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null };

export type RejectModerationCommentVersionMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectModerationCommentVersionMutationMutation = { __typename?: 'Mutation', rejectModerationCommentVersion: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'CommentModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> }> } | null };

export type RejectModerationPostVersionMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
  moderatorNickname: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectModerationPostVersionMutationMutation = { __typename?: 'Mutation', rejectModerationPostVersion: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null };

export type RenewCommentModerationMutationMutationVariables = Exact<{
  commentModerationId: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
}>;


export type RenewCommentModerationMutationMutation = { __typename?: 'Mutation', renewCommentModeration: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'CommentModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> }> } | null };

export type RenewPostModerationMutationMutationVariables = Exact<{
  postModerationId: Scalars['Int']['input'];
  moderatorHash: Scalars['String']['input'];
}>;


export type RenewPostModerationMutationMutation = { __typename?: 'Mutation', renewPostModeration: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null };

export type UpdateCommentMutationVariables = Exact<{
  updateCommentId: Scalars['Int']['input'];
  data: CommentUpdateInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', id: number, content: string } };

export type GetCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<CategoriesFilterInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryConnection', edges: Array<{ __typename?: 'CategoryEdge', node: { __typename?: 'Category', id: number, name: string } }> } | null };

export type CommentQueryVariables = Exact<{
  commentId: Scalars['Int']['input'];
}>;


export type CommentQuery = { __typename?: 'Query', comment: { __typename?: 'Comment', id: number, votesDown: number | null, votesUp: number | null } | null };

export type GetCommentsQueryVariables = Exact<{
  filter?: InputMaybe<CommentsFilterInput>;
  pagination?: InputMaybe<CommentPaginationInput>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: { __typename?: 'CommentConnection', totalCount: number | null, edges: Array<{ __typename?: 'CommentEdge', node: { __typename?: 'Comment', id: number, content: string, votesDown: number | null, votesUp: number | null, moderated: boolean, published: boolean, createdAt: any | null, moderatedAt: any | null, publishedAt: any | null, disabledAt: any | null, authorHash: string, authorNickname: string, post: { __typename?: 'Post', id: number } | null, parent: { __typename?: 'Comment', id: number, authorNickname: string } | null } } | null> | null, pageInfo: { __typename?: 'CommentPageInfo', endCursor: string | null, hasNextPage: boolean | null, startCursor: string | null } } | null };

export type GetModerationCommentByIdQueryVariables = Exact<{
  moderationCommentId: Scalars['Int']['input'];
}>;


export type GetModerationCommentByIdQuery = { __typename?: 'Query', moderationComment: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, post: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, status: ModerationPostStatus, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null, parent: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean }> } | null, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'CommentModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> }> } | null };

export type GetModerationCommentsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetModerationCommentsQuery = { __typename?: 'Query', moderationComments: { __typename?: 'ModerationCommentConnection', totalCount: number | null, edges: Array<{ __typename?: 'ModerationCommentEdge', cursor: string, node: { __typename?: 'ModerationComment', id: number, authorHash: string, authorNickname: string, requiredModerations: number, status: ModerationCommentStatus, versions: Array<{ __typename?: 'ModerationCommentVersion', id: number, content: string, authorHash: string, authorNickname: string, timestamp: string, version: number, latest: boolean }> } } | null> | null, pageInfo: { __typename?: 'ModerationCommentPageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean | null, hasPreviousPage: boolean | null } } | null };

export type GetModerationPostsByIdQueryVariables = Exact<{
  moderationPostId: Scalars['Int']['input'];
}>;


export type GetModerationPostsByIdQuery = { __typename?: 'Query', moderationPost: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, timestamp: string, version: number, authorHash: string, authorNickname: string, reason: string | null, latest: boolean, moderations: Array<{ __typename?: 'PostModeration', id: number, decision: ModerationDecision, moderatorHash: string, moderatorNickname: string, reason: string | null, timestamp: string }> | null }> } | null };

export type GetModerationPostsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetModerationPostsQuery = { __typename?: 'Query', moderationPosts: { __typename?: 'ModerationPostConnection', totalCount: number | null, edges: Array<{ __typename?: 'ModerationPostEdge', cursor: string, node: { __typename?: 'ModerationPost', id: number, authorHash: string, authorNickname: string, requiredModerations: number, status: ModerationPostStatus, versions: Array<{ __typename?: 'ModerationPostVersion', id: number, title: string, content: string, categoryIds: Array<number>, files: Array<string> | null, authorHash: string, authorNickname: string, timestamp: string, version: number, latest: boolean }> } } | null> | null, pageInfo: { __typename?: 'ModerationPostPageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean | null, hasPreviousPage: boolean | null } } | null };

export type PostQueryVariables = Exact<{
  postId: Scalars['Int']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post: { __typename?: 'Post', authorHash: string | null, authorNickname: string | null, content: string, createdAt: any | null, disabledAt: any | null, files: Array<string> | null, id: number, moderated: boolean, moderatedAt: any | null, published: boolean, publishedAt: any | null, title: string, votesDown: number, votesUp: number, categories: Array<{ __typename?: 'Category', id: number, name: string }>, comments: Array<{ __typename?: 'Comment', id: number, content: string }> | null } | null };

export type GetPostsQueryVariables = Exact<{
  sort?: InputMaybe<PostSortingInput>;
  pagination?: InputMaybe<PostPaginationInput>;
  filter?: InputMaybe<PostsFilterInput>;
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', totalCount: number | null, edges: Array<{ __typename?: 'PostEdge', node: { __typename?: 'Post', id: number, title: string, content: string, files: Array<string> | null, createdAt: any | null, moderatedAt: any | null, publishedAt: any | null, published: boolean, moderated: boolean, authorHash: string | null, authorNickname: string | null, votesUp: number, votesDown: number, categories: Array<{ __typename?: 'Category', id: number, name: string }>, comments: Array<{ __typename?: 'Comment', id: number, content: string }> | null } } | null> | null, pageInfo: { __typename?: 'PostPageInfo', endCursor: string | null, hasNextPage: boolean | null, startCursor: string | null } } | null };

export type PostsQueryVariables = Exact<{
  filter?: InputMaybe<PostsFilterInput>;
  pagination?: InputMaybe<PostPaginationInput>;
  sort?: InputMaybe<PostSortingInput>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', totalCount: number | null } | null };

export type GetPresignedDownloadUrlsQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
  keys: Array<Scalars['String']['input']> | Scalars['String']['input'];
  expiresIn: Scalars['Int']['input'];
}>;


export type GetPresignedDownloadUrlsQuery = { __typename?: 'Query', getPresignedDownloadUrls: Array<{ __typename?: 'PresignedUrl', key: string, url: string }> };

export type GetPresignedUrlsQueryVariables = Exact<{
  bucket: Scalars['String']['input'];
  keys: Array<Scalars['String']['input']> | Scalars['String']['input'];
  expiresIn: Scalars['Int']['input'];
}>;


export type GetPresignedUrlsQuery = { __typename?: 'Query', getPresignedUrls: Array<{ __typename?: 'PresignedUrl', key: string, url: string }> };

export type VotesQueryVariables = Exact<{
  filter?: InputMaybe<VotesFilterInput>;
}>;


export type VotesQuery = { __typename?: 'Query', votes: Array<{ __typename?: 'Vote', id: number, voteType: string, authorHash: string, authorNickname: string, comment: { __typename?: 'Comment', id: number } | null, post: { __typename?: 'Post', id: number } }> };


export const ApproveModerationCommentVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveModerationCommentVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveModerationCommentVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ApproveModerationCommentVersionMutation, ApproveModerationCommentVersionMutationVariables>;
export const ApproveModerationPostVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveModerationPostVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveModerationPostVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ApproveModerationPostVersionMutation, ApproveModerationPostVersionMutationVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateModerationCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateModerationComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationCommentCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createModerationComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateModerationCommentMutation, CreateModerationCommentMutationVariables>;
export const CreateModerationPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateModerationPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationPostCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createModerationPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateModerationPostMutation, CreateModerationPostMutationVariables>;
export const CreateOrDeleteVoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrDeleteVote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"voteType"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrDeleteVoteMutation, CreateOrDeleteVoteMutationVariables>;
export const DeleteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteCommentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteCommentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const ModifyModerationCommentVersionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ModifyModerationCommentVersionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationCommentModifyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifyModerationComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ModifyModerationCommentVersionMutationMutation, ModifyModerationCommentVersionMutationMutationVariables>;
export const ModifyModerationPostVersionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ModifyModerationPostVersionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModerationPostModifyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifyModerationPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ModifyModerationPostVersionMutationMutation, ModifyModerationPostVersionMutationMutationVariables>;
export const RejectModerationCommentVersionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectModerationCommentVersionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectModerationCommentVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RejectModerationCommentVersionMutationMutation, RejectModerationCommentVersionMutationMutationVariables>;
export const RejectModerationPostVersionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectModerationPostVersionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectModerationPostVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorNickname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorNickname"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RejectModerationPostVersionMutationMutation, RejectModerationPostVersionMutationMutationVariables>;
export const RenewCommentModerationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenewCommentModerationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentModerationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renewCommentModeration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"commentModerationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentModerationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RenewCommentModerationMutationMutation, RenewCommentModerationMutationMutationVariables>;
export const RenewPostModerationMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenewPostModerationMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postModerationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renewPostModeration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postModerationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postModerationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"moderatorHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderatorHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RenewPostModerationMutationMutation, RenewPostModerationMutationMutationVariables>;
export const UpdateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateCommentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateCommentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CategoriesFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Comment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"votesDown"}},{"kind":"Field","name":{"kind":"Name","value":"votesUp"}}]}}]}}]} as unknown as DocumentNode<CommentQuery, CommentQueryVariables>;
export const GetCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentsFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentPaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"votesDown"}},{"kind":"Field","name":{"kind":"Name","value":"votesUp"}},{"kind":"Field","name":{"kind":"Name","value":"moderated"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"moderatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"disabledAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetCommentsQuery, GetCommentsQueryVariables>;
export const GetModerationCommentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModerationCommentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderationCommentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderationCommentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetModerationCommentByIdQuery, GetModerationCommentByIdQueryVariables>;
export const GetModerationCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModerationComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"NullValue"}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetModerationCommentsQuery, GetModerationCommentsQueryVariables>;
export const GetModerationPostsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModerationPostsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moderationPostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moderationPostId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}},{"kind":"Field","name":{"kind":"Name","value":"moderations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorHash"}},{"kind":"Field","name":{"kind":"Name","value":"moderatorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetModerationPostsByIdQuery, GetModerationPostsByIdQueryVariables>;
export const GetModerationPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModerationPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderationPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"NullValue"}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"requiredModerations"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"categoryIds"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"latest"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetModerationPostsQuery, GetModerationPostsQueryVariables>;
export const PostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Post"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"disabledAt"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"moderated"}},{"kind":"Field","name":{"kind":"Name","value":"moderatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"votesDown"}},{"kind":"Field","name":{"kind":"Name","value":"votesUp"}}]}}]}}]} as unknown as DocumentNode<PostQuery, PostQueryVariables>;
export const GetPostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPosts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostSortingInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostPaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"moderatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"moderated"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}},{"kind":"Field","name":{"kind":"Name","value":"votesUp"}},{"kind":"Field","name":{"kind":"Name","value":"votesDown"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const PostsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Posts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostsFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostPaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostSortingInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<PostsQuery, PostsQueryVariables>;
export const GetPresignedDownloadUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresignedDownloadUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keys"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expiresIn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedDownloadUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"keys"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keys"}}},{"kind":"Argument","name":{"kind":"Name","value":"expiresIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expiresIn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetPresignedDownloadUrlsQuery, GetPresignedDownloadUrlsQueryVariables>;
export const GetPresignedUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPresignedUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keys"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expiresIn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}},{"kind":"Argument","name":{"kind":"Name","value":"keys"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keys"}}},{"kind":"Argument","name":{"kind":"Name","value":"expiresIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expiresIn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetPresignedUrlsQuery, GetPresignedUrlsQueryVariables>;
export const VotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Votes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VotesFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"voteType"}},{"kind":"Field","name":{"kind":"Name","value":"authorHash"}},{"kind":"Field","name":{"kind":"Name","value":"authorNickname"}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<VotesQuery, VotesQueryVariables>;