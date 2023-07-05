
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ModerationDecision {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export enum ModerationCommentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum ModerationPostStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum sortOrder {
    asc = "asc",
    desc = "desc"
}

export enum CacheControlScope {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export class CategoryCreateInput {
    name: string;
    description?: Nullable<string>;
    parentId?: Nullable<number>;
}

export class CategoryUpdateInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    parentId?: Nullable<number>;
}

export class CategoriesFilterInput {
    ids?: Nullable<Nullable<number>[]>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    weight?: Nullable<number>;
    active?: Nullable<boolean>;
    parentId?: Nullable<number>;
    createdAfter?: Nullable<DateTime>;
    createdBefore?: Nullable<DateTime>;
    disabledAfter?: Nullable<DateTime>;
    disabledBefore?: Nullable<DateTime>;
}

export class CategoryPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class CommentCreateInput {
    content: string;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorHash: string;
    authorNickname: string;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class CommentUpdateInput {
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
}

export class CommentsFilterInput {
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
    createdAfter?: Nullable<DateTime>;
    createdBefore?: Nullable<DateTime>;
    moderatedAfter?: Nullable<DateTime>;
    moderatedBefore?: Nullable<DateTime>;
    publishedAfter?: Nullable<DateTime>;
    publishedBefore?: Nullable<DateTime>;
    disabledAfter?: Nullable<DateTime>;
    disabledBefore?: Nullable<DateTime>;
}

export class CommentPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class ContactFormEntryCreateInput {
    name: string;
    email: string;
    message: string;
    recaptchaToken: string;
}

export class ModerationCommentCreateInput {
    content: string;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
    authorHash: string;
    authorNickname: string;
}

export class ModerationCommentsFilterInput {
    status?: Nullable<ModerationCommentStatus>;
    published?: Nullable<boolean>;
    archived?: Nullable<boolean>;
}

export class ModerationCommentPaginationInput {
    before?: Nullable<string>;
    after?: Nullable<string>;
    limit?: Nullable<number>;
}

export class ModerationCommentModifyInput {
    content?: Nullable<string>;
}

export class ModerationPostCreateInput {
    title: string;
    content: string;
    categoryIds: number[];
    files?: Nullable<Nullable<string>[]>;
    authorHash: string;
    authorNickname: string;
}

export class ModerationPostsFilterInput {
    status?: Nullable<ModerationPostStatus>;
    published?: Nullable<boolean>;
    archived?: Nullable<boolean>;
}

export class ModerationPostPaginationInput {
    after?: Nullable<string>;
    before?: Nullable<string>;
    limit?: Nullable<number>;
}

export class ModerationPostModifyInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    categoryIds?: Nullable<number[]>;
    files?: Nullable<Nullable<string>[]>;
}

export class PollPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class PollFilterInput {
    question?: Nullable<string>;
    published?: Nullable<boolean>;
    active?: Nullable<boolean>;
    postLink?: Nullable<string>;
    weight?: Nullable<number>;
    expiresBefore?: Nullable<DateTime>;
    expiresAfter?: Nullable<DateTime>;
    expiresExcludeNull?: Nullable<boolean>;
    createdBefore?: Nullable<DateTime>;
    createdAfter?: Nullable<DateTime>;
}

export class PollCreateInput {
    published: boolean;
    active: boolean;
    postLink?: Nullable<string>;
    weight: number;
    expiresAt?: Nullable<DateTime>;
    question: string;
    options: PollOptionCreateInput[];
}

export class PollUpdateInput {
    published?: Nullable<boolean>;
    active?: Nullable<boolean>;
    postLink?: Nullable<string>;
    weight?: Nullable<number>;
    expiresAt?: Nullable<DateTime>;
    question?: Nullable<string>;
    options?: Nullable<PollOptionCreateInput[]>;
}

export class PollOptionCreateInput {
    option: string;
}

export class VoteInput {
    voterHash: string;
    pollId: number;
    optionId: number;
}

export class PostUpdateInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    files?: Nullable<string[]>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
    categoryIds?: Nullable<number[]>;
}

export class PostsFilterInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
    categoryIds?: Nullable<number[]>;
    createdAfter?: Nullable<DateTime>;
    createdBefore?: Nullable<DateTime>;
    moderatedAfter?: Nullable<DateTime>;
    moderatedBefore?: Nullable<DateTime>;
    publishedAfter?: Nullable<DateTime>;
    publishedBefore?: Nullable<DateTime>;
}

export class PostSortingInput {
    sortByCreatedAt?: Nullable<sortOrder>;
    sortBypublishedAt?: Nullable<sortOrder>;
    sortByModeratedAt?: Nullable<sortOrder>;
    sortByVotesUp?: Nullable<sortOrder>;
    sortByVotesDown?: Nullable<sortOrder>;
    sortByCommentsCount?: Nullable<sortOrder>;
}

export class PostPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class VoteCreateInput {
    voteType: string;
    authorHash: string;
    authorNickname: string;
    postId: number;
    commentId?: Nullable<number>;
}

export class VotesFilterInput {
    voteType?: Nullable<string>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
    postId?: Nullable<number>;
    commentId?: Nullable<number>;
}

export class UserCreateInput {
    orgId: number;
    hash: string;
    title?: Nullable<string>;
    nickname?: Nullable<string>;
    typeId: number;
    active?: Nullable<boolean>;
    disabledAt?: Nullable<DateTime>;
    verifiedAt?: Nullable<DateTime>;
}

export class UserUpdateInput {
    orgId?: Nullable<number>;
    hash?: Nullable<string>;
    title?: Nullable<string>;
    nickname?: Nullable<string>;
    typeId?: Nullable<number>;
    active?: Nullable<boolean>;
    disabledAt?: Nullable<DateTime>;
    verifiedAt?: Nullable<DateTime>;
}

export interface BasePoll {
    id: number;
    question: string;
    published: boolean;
    active: boolean;
    postLink?: Nullable<string>;
    weight: number;
    createdAt: DateTime;
    expiresAt?: Nullable<DateTime>;
}

export interface BasePollOption {
    id: number;
    option: string;
}

export abstract class IQuery {
    abstract category(id: number): Nullable<Category> | Promise<Nullable<Category>>;

    abstract categories(filter?: Nullable<CategoriesFilterInput>, pagination?: Nullable<CategoryPaginationInput>): Nullable<CategoryConnection> | Promise<Nullable<CategoryConnection>>;

    abstract comment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract comments(filter?: Nullable<CommentsFilterInput>, pagination?: Nullable<CommentPaginationInput>): Nullable<CommentConnection> | Promise<Nullable<CommentConnection>>;

    abstract moderationComment(id: number): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract moderationComments(filter?: Nullable<ModerationCommentsFilterInput>, pagination?: Nullable<ModerationCommentPaginationInput>): Nullable<ModerationCommentConnection> | Promise<Nullable<ModerationCommentConnection>>;

    abstract commentVersion(id: number): Nullable<ModerationCommentVersion> | Promise<Nullable<ModerationCommentVersion>>;

    abstract moderationPost(id: number): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract moderationPosts(filter?: Nullable<ModerationPostsFilterInput>, pagination?: Nullable<ModerationPostPaginationInput>): Nullable<ModerationPostConnection> | Promise<Nullable<ModerationPostConnection>>;

    abstract postVersion(id: number): Nullable<ModerationPostVersion> | Promise<Nullable<ModerationPostVersion>>;

    abstract availablePolls(userHash: string): Poll[] | Promise<Poll[]>;

    abstract votedPolls(userHash: string, pagination: PollPaginationInput): PollWithStatsConnection | Promise<PollWithStatsConnection>;

    abstract pollsWithResult(moderatorHash: string, filter: PollFilterInput, pagination: PollPaginationInput): PollWithResultConnection | Promise<PollWithResultConnection>;

    abstract post(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract posts(filter?: Nullable<PostsFilterInput>, pagination?: Nullable<PostPaginationInput>, sort?: Nullable<PostSortingInput>): PostConnection | Promise<PostConnection>;

    abstract postsByCategories(categories: string[], filter?: Nullable<PostsFilterInput>, pagination?: Nullable<PostPaginationInput>): PostConnection | Promise<PostConnection>;

    abstract getPresignedUrls(keys: string[], expiresIn: number): PresignedUrl[] | Promise<PresignedUrl[]>;

    abstract getPresignedDownloadUrls(keys: string[], expiresIn: number): PresignedUrl[] | Promise<PresignedUrl[]>;

    abstract vote(id: number): Nullable<Vote> | Promise<Nullable<Vote>>;

    abstract votes(filter?: Nullable<VotesFilterInput>): Vote[] | Promise<Vote[]>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): User[] | Promise<User[]>;
}

export abstract class IMutation {
    abstract createCategory(data: CategoryCreateInput): Category | Promise<Category>;

    abstract updateCategory(id: number, data: CategoryUpdateInput): Category | Promise<Category>;

    abstract deleteCategory(id: number): Category | Promise<Category>;

    abstract createComment(data: CommentCreateInput): Comment | Promise<Comment>;

    abstract updateComment(id: number, data: CommentUpdateInput): Comment | Promise<Comment>;

    abstract deleteComment(id: number): Comment | Promise<Comment>;

    abstract createContactFormEntry(data: ContactFormEntryCreateInput): string | Promise<string>;

    abstract createModerationComment(data: ModerationCommentCreateInput): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract approveModerationCommentVersion(id: number, moderatorHash: string, moderatorNickname: string, reason?: Nullable<string>): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract rejectModerationCommentVersion(id: number, moderatorHash: string, moderatorNickname: string, reason?: Nullable<string>): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract modifyModerationComment(commentId: number, moderatorHash: string, moderatorNickname: string, reason: string, data: ModerationCommentModifyInput): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract rollbackModifiedModerationComment(commentId: number): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract renewCommentModeration(commentModerationId: number, moderatorHash: string): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract createModerationPost(data: ModerationPostCreateInput): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract approveModerationPostVersion(id: number, moderatorHash: string, moderatorNickname: string, reason?: Nullable<string>): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract rejectModerationPostVersion(id: number, moderatorHash: string, moderatorNickname: string, reason: string): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract modifyModerationPost(postId: number, moderatorHash: string, moderatorNickname: string, reason: string, data: ModerationPostModifyInput): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract rollbackModifiedModerationPost(postId: number): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract renewPostModeration(postModerationId: number, moderatorHash: string): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract createPoll(data: PollCreateInput): Poll | Promise<Poll>;

    abstract updatePoll(pollId: number, data: PollUpdateInput): Poll | Promise<Poll>;

    abstract removePoll(pollId: number): number | Promise<number>;

    abstract votePoll(voteInput?: Nullable<VoteInput>): VoteResponse | Promise<VoteResponse>;

    abstract deletePost(id: number): Post | Promise<Post>;

    abstract createVote(data: VoteCreateInput): Vote | Promise<Vote>;

    abstract deleteVote(id: number): Vote | Promise<Vote>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract createUser(data: UserCreateInput): User | Promise<User>;

    abstract updateUser(id: number, data: UserUpdateInput): User | Promise<User>;

    abstract deleteUser(id: number): User | Promise<User>;
}

export class Category {
    id: number;
    name: string;
    description?: Nullable<string>;
    weight: number;
    active: boolean;
    createdAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    parent?: Nullable<Category>;
    children?: Nullable<Category[]>;
    posts?: Nullable<Post[]>;
    numPosts: number;
}

export class CategoryEdge {
    node: Category;
    cursor: string;
}

export class CategoryConnection {
    pageInfo: CategoryPageInfo;
    edges: CategoryEdge[];
}

export class CategoryPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
}

export class Comment {
    id: number;
    content: string;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    moderated: boolean;
    published: boolean;
    createdAt?: Nullable<DateTime>;
    moderatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    authorHash: string;
    authorNickname: string;
    post?: Nullable<Post>;
    parent?: Nullable<Comment>;
    children: Comment[];
    votes: Vote[];
}

export class CommentEdge {
    node: Comment;
    cursor: string;
}

export class CommentConnection {
    totalCount?: Nullable<number>;
    pageInfo: CommentPageInfo;
    edges?: Nullable<Nullable<CommentEdge>[]>;
}

export class CommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
}

export class ModerationComment {
    id: number;
    status: ModerationCommentStatus;
    versions: ModerationCommentVersion[];
    requiredModerations: number;
    timestamp: string;
    authorHash: string;
    authorNickname: string;
    post?: Nullable<ModerationPost>;
    parentId?: Nullable<number>;
    parent?: Nullable<ModerationComment>;
    children: ModerationComment[];
}

export class ModerationCommentVersion {
    id: number;
    content: string;
    version: number;
    authorHash: string;
    authorNickname: string;
    reason?: Nullable<string>;
    latest: boolean;
    timestamp: string;
    comment: ModerationComment;
    moderations: CommentModeration[];
}

export class CommentModeration {
    id: number;
    commentVersion: ModerationCommentVersion;
    moderatorHash: string;
    moderatorNickname: string;
    decision: ModerationDecision;
    reason?: Nullable<string>;
    timestamp: string;
}

export class ModerationCommentEdge {
    node: ModerationComment;
    cursor: string;
}

export class ModerationCommentConnection {
    totalCount?: Nullable<number>;
    pageInfo: ModerationCommentPageInfo;
    edges?: Nullable<Nullable<ModerationCommentEdge>[]>;
}

export class ModerationCommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
    hasPreviousPage?: Nullable<boolean>;
}

export class ModerationPost {
    id: number;
    status: ModerationPostStatus;
    versions: ModerationPostVersion[];
    requiredModerations: number;
    authorHash: string;
    authorNickname: string;
}

export class ModerationPostVersion {
    id: number;
    title: string;
    content: string;
    categoryIds: number[];
    files?: Nullable<string[]>;
    version: number;
    reason?: Nullable<string>;
    authorHash: string;
    authorNickname: string;
    latest: boolean;
    timestamp: string;
    moderations?: Nullable<PostModeration[]>;
}

export class PostModeration {
    id: number;
    postVersion: ModerationPostVersion;
    moderatorHash: string;
    moderatorNickname: string;
    decision: ModerationDecision;
    reason?: Nullable<string>;
    timestamp: string;
}

export class ModerationPostEdge {
    node: ModerationPost;
    cursor: string;
}

export class ModerationPostConnection {
    totalCount?: Nullable<number>;
    pageInfo: ModerationPostPageInfo;
    edges?: Nullable<Nullable<ModerationPostEdge>[]>;
}

export class ModerationPostPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
    hasPreviousPage?: Nullable<boolean>;
}

export class PollOption implements BasePollOption {
    id: number;
    option: string;
}

export class Poll implements BasePoll {
    id: number;
    question: string;
    published: boolean;
    active: boolean;
    postLink?: Nullable<string>;
    weight: number;
    createdAt: DateTime;
    expiresAt?: Nullable<DateTime>;
    options: PollOption[];
}

export class PollPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
}

export class PollOptionWithResult implements BasePollOption {
    id: number;
    option: string;
    numVotes: number;
}

export class PollWithResult implements BasePoll {
    id: number;
    question: string;
    published: boolean;
    active: boolean;
    postLink?: Nullable<string>;
    weight: number;
    createdAt: DateTime;
    expiresAt?: Nullable<DateTime>;
    options: PollOptionWithResult[];
}

export class PollWithResultEdge {
    node: PollWithResult;
    cursor: string;
}

export class PollWithResultConnection {
    totalCount?: Nullable<number>;
    pageInfo: PollPageInfo;
    edges: PollWithResultEdge[];
}

export class VoteResponse {
    pollId: number;
    optionId: number;
    stats?: Nullable<PollOptionStat[]>;
}

export class PollOptionStat {
    optionId: number;
    proportion: number;
}

export class PollWithStats implements BasePoll {
    id: number;
    question: string;
    published: boolean;
    active: boolean;
    postLink?: Nullable<string>;
    weight: number;
    createdAt: DateTime;
    expiresAt?: Nullable<DateTime>;
    options: PollOption[];
    stats?: Nullable<PollOptionStat[]>;
}

export class PollWithStatsEdge {
    node: PollWithStats;
    cursor: string;
}

export class PollWithStatsConnection {
    totalCount?: Nullable<number>;
    pageInfo: PollPageInfo;
    edges: PollWithStatsEdge[];
}

export class Post {
    id: number;
    title: string;
    content: string;
    files?: Nullable<string[]>;
    moderated: boolean;
    published: boolean;
    votesDown: number;
    votesUp: number;
    createdAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    moderatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
    authorHash?: Nullable<string>;
    authorNickname?: Nullable<string>;
    categories: Category[];
    comments: Comment[];
    votes: Vote[];
    presignedDownloadUrls?: PresignedUrl[];
}

export class PresignedUrl {
    url: string;
    key: string;
}

export class PostEdge {
    node: Post;
    cursor: string;
}

export class PostConnection {
    totalCount: number;
    pageInfo: PostPageInfo;
    edges: PostEdge[];
}

export class PostPageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
}

export class Vote {
    id: number;
    voteType: string;
    authorHash: string;
    authorNickname: string;
    post: Post;
    comment?: Nullable<Comment>;
}

export class User {
    id: number;
    orgId: number;
    hash: string;
    title?: Nullable<string>;
    nickname?: Nullable<string>;
    type: UserType;
    active?: Nullable<boolean>;
    createdAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    verifiedAt?: Nullable<DateTime>;
    comments: Comment[];
    posts: Post[];
}

export class UserType {
    id: number;
    type: string;
    users: User[];
}

export type DateTime = any;
type Nullable<T> = T | null;
