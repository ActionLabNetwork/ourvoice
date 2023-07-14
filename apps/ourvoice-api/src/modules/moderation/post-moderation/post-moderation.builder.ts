import {
  Post,
  PostVersion,
  PostModeration,
  PostStatus,
  Decision,
} from '@prisma-moderation-db/client';

class PostBuilder {
  private post: Partial<
    Post & { versions: (PostVersion & { moderations: PostModeration[] })[] }
  > = {};

  constructor(post?: Partial<Post>) {
    this.post = structuredClone(post) ?? {};
  }

  withId(id: number): PostBuilder {
    this.post.id = id;
    return this;
  }
  withStatus(status: PostStatus): PostBuilder {
    this.post.status = status;
    return this;
  }

  withVersions(versions: (PostVersion & { moderations: PostModeration[] })[]) {
    this.post.versions = versions;
    return this;
  }

  withRequiredModerations(requiredModerations: number): PostBuilder {
    this.post.requiredModerations = requiredModerations;
    return this;
  }

  withAuthorHash(authorHash: string): PostBuilder {
    this.post.authorHash = authorHash;
    return this;
  }

  withAuthorNickname(authorNickname: string): PostBuilder {
    this.post.authorNickname = authorNickname;
    return this;
  }

  withPostIdInMainDb(postIdInMainDb: number | null): PostBuilder {
    this.post.postIdInMainDb = postIdInMainDb;
    return this;
  }

  withArchived(archived: boolean): PostBuilder {
    this.post.archived = archived;
    return this;
  }

  build(): Partial<Post> {
    return this.post;
  }
}

class PostVersionBuilder {
  private version: Partial<
    PostVersion & {
      post: Partial<Post>;
      moderations: Partial<PostModeration[]>;
    }
  > = {};

  constructor(
    version?: Partial<
      PostVersion & {
        post: Partial<Post>;
        moderations: Partial<PostModeration[]>;
      }
    >,
  ) {
    this.version = structuredClone(version) ?? {};
  }

  withId(id: number): PostVersionBuilder {
    this.version.id = id;
    return this;
  }

  withTitle(title: string): PostVersionBuilder {
    this.version.title = title;
    return this;
  }

  withContent(content: string): PostVersionBuilder {
    this.version.content = content;
    return this;
  }

  withCategoryIds(categoryIds: number[]): PostVersionBuilder {
    this.version.categoryIds = categoryIds;
    return this;
  }

  withFiles(files: string[]): PostVersionBuilder {
    this.version.files = files;
    return this;
  }

  withVersion(version: number): PostVersionBuilder {
    this.version.version = version;
    return this;
  }

  withAuthorHash(authorHash: string): PostVersionBuilder {
    this.version.authorHash = authorHash;
    return this;
  }

  withAuthorNickname(authorNickname: string): PostVersionBuilder {
    this.version.authorNickname = authorNickname;
    return this;
  }

  withReason(reason: string): PostVersionBuilder {
    this.version.reason = reason;
    return this;
  }

  withLatest(latest: boolean): PostVersionBuilder {
    this.version.latest = latest;
    return this;
  }

  withTimestamp(timestamp: Date): PostVersionBuilder {
    this.version.timestamp = timestamp;
    return this;
  }

  withPost(post: Post): PostVersionBuilder {
    this.version.post = post;
    return this;
  }

  withPostId(postId: number): PostVersionBuilder {
    this.version.postId = postId;
    return this;
  }

  withModerations(
    moderations: PostModeration[] | Partial<PostModeration[]>,
  ): PostVersionBuilder {
    this.version.moderations = moderations;
    return this;
  }

  build(): Partial<PostVersion> {
    return this.version;
  }
}

class PostModerationBuilder {
  private moderation: Partial<
    PostModeration & { postVersion: Partial<PostVersion> }
  > = {};

  constructor(moderation?: PostModeration) {
    this.moderation = structuredClone(moderation) ?? {};
  }

  withId(id: number): PostModerationBuilder {
    this.moderation.id = id;
    return this;
  }

  withPostVersion(postVersion: PostVersion): PostModerationBuilder {
    this.moderation.postVersion = postVersion;
    return this;
  }

  withPostVersionId(postVersionId: number): PostModerationBuilder {
    this.moderation.postVersionId = postVersionId;
    return this;
  }

  withModeratorHash(moderatorHash: string): PostModerationBuilder {
    this.moderation.moderatorHash = moderatorHash;
    return this;
  }

  withModeratorNickname(moderatorNickname: string): PostModerationBuilder {
    this.moderation.moderatorNickname = moderatorNickname;
    return this;
  }

  withDecision(decision: Decision): PostModerationBuilder {
    this.moderation.decision = decision;
    return this;
  }

  withReason(reason: string): PostModerationBuilder {
    this.moderation.reason = reason;
    return this;
  }

  withTimestamp(timestamp: Date): PostModerationBuilder {
    this.moderation.timestamp = timestamp;
    return this;
  }

  build(): Partial<PostModeration> {
    return this.moderation;
  }
}

export { PostBuilder, PostVersionBuilder, PostModerationBuilder };
