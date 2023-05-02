/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CommentCreateInput {
    content: string;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    authorId?: Nullable<number>;
    postId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class CommentUpdateInput {
    content?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
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

export class PaginationInput {
    cursor: number;
    limit: number;
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

export abstract class IQuery {
    abstract comment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract comments(): Comment[] | Promise<Comment[]>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): User[] | Promise<User[]>;

    abstract category(id: number): Nullable<Category> | Promise<Nullable<Category>>;

    abstract categories(filter?: Nullable<CategoriesFilterInput>, pagination?: Nullable<PaginationInput>): Category[] | Promise<Category[]>;

    abstract categoriesByNames(names: string[]): Category[] | Promise<Category[]>;

    abstract post(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract posts(filter?: Nullable<PostsFilterInput>, pagination?: Nullable<PaginationInput>): Nullable<PostConnection> | Promise<Nullable<PostConnection>>;

    abstract postsByCategories(categories: string[]): Post[] | Promise<Post[]>;

    abstract getPresignedUrls(bucket: string, keys: string[], expiresIn: number): PresignedUrl[] | Promise<PresignedUrl[]>;
}

export abstract class IMutation {
    abstract createComment(data: CommentCreateInput): Comment | Promise<Comment>;

    abstract updateComment(id: number, data: CommentUpdateInput): Comment | Promise<Comment>;

    abstract deleteComment(id: number): Comment | Promise<Comment>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract createUser(data: UserCreateInput): User | Promise<User>;

    abstract updateUser(id: number, data: UserUpdateInput): User | Promise<User>;

    abstract deleteUser(id: number): User | Promise<User>;

    abstract createVote(data: VoteCreateInput): Vote | Promise<Vote>;

    abstract deleteVote(id: number): Vote | Promise<Vote>;

    abstract createCategory(data: CategoryCreateInput): Category | Promise<Category>;

    abstract updateCategory(id: number, data: CategoryUpdateInput): Category | Promise<Category>;

    abstract deleteCategory(id: number): Category | Promise<Category>;

    abstract createPost(data: PostCreateInput): Post | Promise<Post>;

    abstract updatePost(id: number, data: PostUpdateInput): Post | Promise<Post>;

    abstract deletePost(id: number): Post | Promise<Post>;
}

export class Comment {
    id: number;
    content: string;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    createdAt?: Nullable<DateTime>;
    moderatedAt?: Nullable<DateTime>;
    publishedAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    author?: Nullable<User>;
    post?: Nullable<Post>;
    parent?: Nullable<Comment>;
    children: Comment[];
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

export class Category {
    id: number;
    name: string;
    description?: Nullable<string>;
    weight: number;
    active: boolean;
    createdAt?: Nullable<DateTime>;
    disabledAt?: Nullable<DateTime>;
    parent?: Nullable<Category>;
    children: Category[];
    posts: Post[];
}

export class PageInfo {
    endCursor?: Nullable<number>;
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
    pageInfo: PageInfo;
    edges?: Nullable<Nullable<PostEdge>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
