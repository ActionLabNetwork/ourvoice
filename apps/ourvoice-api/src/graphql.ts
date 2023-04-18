/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CategoryCreateInput {
    name: string;
    description?: Nullable<string>;
    weight?: Nullable<number>;
    active?: Nullable<boolean>;
    parentId?: Nullable<number>;
}

export class CategoryUpdateInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    weight?: Nullable<number>;
    active?: Nullable<boolean>;
    parentId?: Nullable<number>;
}

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

export class PostCreateInput {
    title?: Nullable<string>;
    content: string;
    file?: Nullable<string>;
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
    file?: Nullable<string>;
    moderated?: Nullable<boolean>;
    published?: Nullable<boolean>;
    votesDown?: Nullable<number>;
    votesUp?: Nullable<number>;
    authorId?: Nullable<number>;
    categoryIds?: Nullable<number[]>;
}

export abstract class IQuery {
    abstract category(id: number): Nullable<Category> | Promise<Nullable<Category>>;

    abstract categories(): Category[] | Promise<Category[]>;

    abstract comment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;

    abstract comments(): Comment[] | Promise<Comment[]>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): User[] | Promise<User[]>;

    abstract post(id: number): Nullable<Post> | Promise<Nullable<Post>>;

    abstract postsByCategories(categories: string[]): Post[] | Promise<Post[]>;
}

export abstract class IMutation {
    abstract createCategory(data: CategoryCreateInput): Category | Promise<Category>;

    abstract updateCategory(id: number, data: CategoryUpdateInput): Category | Promise<Category>;

    abstract deleteCategory(id: number): Category | Promise<Category>;

    abstract createComment(data: CommentCreateInput): Comment | Promise<Comment>;

    abstract updateComment(id: number, data: CommentUpdateInput): Comment | Promise<Comment>;

    abstract deleteComment(id: number): Comment | Promise<Comment>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;

    abstract createUser(data: UserCreateInput): User | Promise<User>;

    abstract updateUser(id: number, data: UserUpdateInput): User | Promise<User>;

    abstract deleteUser(id: number): User | Promise<User>;

    abstract createVote(data: VoteCreateInput): Vote | Promise<Vote>;

    abstract deleteVote(id: number): Vote | Promise<Vote>;

    abstract createPost(data: PostCreateInput): Post | Promise<Post>;

    abstract updatePost(id: number, data: PostUpdateInput): Post | Promise<Post>;

    abstract deletePost(id: number): Post | Promise<Post>;
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

export class Post {
    id: number;
    title?: Nullable<string>;
    content: string;
    file?: Nullable<string>;
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

export type DateTime = any;
type Nullable<T> = T | null;
