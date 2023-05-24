
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
    authorId: number;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class CommentUpdateInput {
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorId?: Nullable<number>;
}

export class CommentsFilterInput {
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorId?: Nullable<number>;
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

export class ModerationCommentsFilterInput {
    content?: Nullable<string>;
    status?: Nullable<ModerationCommentStatus>;
    authorHash?: Nullable<string>;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class ModerationCommentPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class ModerationPostCreateInput {
    title: string;
    content: string;
    categoryIds: number[];
    files?: Nullable<Nullable<string>[]>;
    authorHash: string;
    requiredModerations: number;
}

export class ModerationPostsFilterInput {
    status?: Nullable<ModerationPostStatus>;
}

export class ModerationPostPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
}

export class PostCreateInput {
    title: string;
    content: string;
    files?: Nullable<string[]>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorId: number;
    categoryIds: number[];
}

export class PostUpdateInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    files?: Nullable<string[]>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorId?: Nullable<number>;
    categoryIds?: Nullable<number[]>;
}

export class PostsFilterInput {
    title?: Nullable<string>;
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorId?: Nullable<number>;
    categoryIds?: Nullable<number[]>;
    createdAfter?: Nullable<DateTime>;
    createdBefore?: Nullable<DateTime>;
    moderatedAfter?: Nullable<DateTime>;
    moderatedBefore?: Nullable<DateTime>;
    publishedAfter?: Nullable<DateTime>;
    publishedBefore?: Nullable<DateTime>;
}

export class PostPaginationInput {
    cursor?: Nullable<string>;
    limit?: Nullable<number>;
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

export class VoteCreateInput {
    voteType: string;
    userId: number;
    postId: number;
}

export abstract class IQuery {
    abstract category(id: number): Nullable<Category> | Promise<Nullable<Category>>;

    abstract categories(filter?: Nullable<CategoriesFilterInput>, pagination?: Nullable<CategoryPaginationInput>): Nullable<CategoryConnection> | Promise<Nullable<CategoryConnection>>;

    abstract comment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract comments(filter?: Nullable<CommentsFilterInput>, pagination?: Nullable<CommentPaginationInput>): Nullable<CommentConnection> | Promise<Nullable<CommentConnection>>;

    abstract moderationComment(id: number): Nullable<ModerationComment> | Promise<Nullable<ModerationComment>>;

    abstract moderationComments(filter?: Nullable<ModerationCommentsFilterInput>, pagination?: Nullable<ModerationCommentPaginationInput>): Nullable<ModerationCommentConnection> | Promise<Nullable<ModerationCommentConnection>>;

    abstract moderationPost(id: number): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract moderationPosts(filter?: Nullable<ModerationPostsFilterInput>, pagination?: Nullable<ModerationPostPaginationInput>): Nullable<ModerationPostConnection> | Promise<Nullable<ModerationPostConnection>>;

    abstract post(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract posts(filter?: Nullable<PostsFilterInput>, pagination?: Nullable<PostPaginationInput>): Nullable<PostConnection> | Promise<Nullable<PostConnection>>;

    abstract postsByCategories(categories: string[], filter?: Nullable<PostsFilterInput>, pagination?: Nullable<PostPaginationInput>): Nullable<PostConnection> | Promise<Nullable<PostConnection>>;

    abstract getPresignedUrls(bucket: string, keys: string[], expiresIn: number): PresignedUrl[] | Promise<PresignedUrl[]>;

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

    abstract createModerationPost(data: ModerationPostCreateInput): Nullable<ModerationPost> | Promise<Nullable<ModerationPost>>;

    abstract createPost(data: PostCreateInput): Post | Promise<Post>;

    abstract updatePost(id: number, data: PostUpdateInput): Post | Promise<Post>;

    abstract deletePost(id: number): Post | Promise<Post>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract createUser(data: UserCreateInput): User | Promise<User>;

    abstract updateUser(id: number, data: UserUpdateInput): User | Promise<User>;

    abstract deleteUser(id: number): User | Promise<User>;

    abstract createVote(data: VoteCreateInput): Vote | Promise<Vote>;

    abstract deleteVote(id: number): Vote | Promise<Vote>;
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
    moderated: boolean;
    published: boolean;
    createdAt?: Nullable<DateTime>;
    moderatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    author: User;
    post?: Nullable<Post>;
    parent?: Nullable<Comment>;
    children: Comment[];
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
    status: ModerationPostStatus;
    version: number;
    timestamp: string;
    latest: boolean;
    authorHash: string;
    post?: Nullable<ModerationPost>;
    parentId?: Nullable<number>;
    parent?: Nullable<ModerationComment>;
    children: ModerationComment[];
    versions: ModerationCommentVersion[];
}

export class ModerationCommentVersion {
    id: number;
    content: string;
    version: number;
    status: ModerationPostStatus;
    latest: boolean;
    timestamp: string;
    comment: ModerationComment;
    moderations: CommentModeration[];
}

export class CommentModeration {
    id: number;
    commentVersion: ModerationCommentVersion;
    moderatorHash: string;
    decision: ModerationDecision;
    reason?: Nullable<string>;
    timestamp: string;
    modifiedContent?: Nullable<string>;
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
}

export class ModerationPost {
    id: number;
    status: ModerationPostStatus;
    versions: ModerationPostVersion[];
    requiredModerations: number;
    comments: ModerationComment[];
    authorHash: string;
}

export class ModerationPostVersion {
    id: number;
    title: string;
    content: string;
    categoryIds: number[];
    files?: Nullable<string>;
    version: number;
    status: ModerationPostStatus;
    latest: boolean;
    timestamp: string;
    post: Post;
    moderations: PostModeration[];
}

export class PostModeration {
    id: number;
    postVersion: ModerationPostVersion;
    moderatorHash: string;
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
    author: User;
    categories: Category[];
    comments: Comment[];
    votes: Vote[];
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
    totalCount?: Nullable<number>;
    pageInfo: PostPageInfo;
    edges?: Nullable<Nullable<PostEdge>[]>;
}

export class PostPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasNextPage?: Nullable<boolean>;
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

export class Vote {
    id: number;
    voteType: string;
    user: User;
    post: Post;
}

export type DateTime = any;
type Nullable<T> = T | null;
