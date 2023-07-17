import {
  Comment,
  CommentVersion,
  CommentModeration,
  PostStatus,
  Decision,
  Post,
  PostVersion,
  PostModeration,
} from '@prisma-moderation-db/client';

class CommentBuilder {
  private comment: Partial<
    Comment & {
      post: Partial<
        Post & { versions: (PostVersion & { moderations: PostModeration[] })[] }
      >;
      parent: Partial<Comment>;
      versions: (CommentVersion & { moderations: CommentModeration[] })[];
    }
  > = {
    parentId: null,
  };

  constructor(comment?: Partial<Comment>) {
    this.comment = structuredClone(comment) ?? {};
  }

  withId(id: number): CommentBuilder {
    this.comment.id = id;
    return this;
  }
  withStatus(status: PostStatus): CommentBuilder {
    this.comment.status = status;
    return this;
  }

  withVersions(
    versions: (CommentVersion & { moderations: CommentModeration[] })[],
  ) {
    this.comment.versions = versions;
    return this;
  }

  withRequiredModerations(requiredModerations: number): CommentBuilder {
    this.comment.requiredModerations = requiredModerations;
    return this;
  }

  withAuthorHash(authorHash: string): CommentBuilder {
    this.comment.authorHash = authorHash;
    return this;
  }

  withAuthorNickname(authorNickname: string): CommentBuilder {
    this.comment.authorNickname = authorNickname;
    return this;
  }

  withCommentIdInMainDb(commentIdInMainDb: number | null): CommentBuilder {
    this.comment.commentIdInMainDb = commentIdInMainDb;
    return this;
  }

  withPost(
    post: Partial<
      Post & { versions: (PostVersion & { moderations: PostModeration[] })[] }
    >,
  ): CommentBuilder {
    this.comment.post = post;
    return this;
  }

  withPostId(postId: number): CommentBuilder {
    this.comment.postId = postId;
    return this;
  }

  withParent(parent: Comment): CommentBuilder {
    this.comment.parent = parent;
    return this;
  }

  withParentId(parentId: number | null): CommentBuilder {
    this.comment.parentId = parentId;
    return this;
  }

  withArchived(archived: boolean): CommentBuilder {
    this.comment.archived = archived;
    return this;
  }

  build(): Partial<Comment> {
    return this.comment;
  }
}

class CommentVersionBuilder {
  private version: Partial<
    CommentVersion & {
      comment: Partial<Comment>;
      moderations: Partial<CommentModeration[]>;
    }
  > = {};

  constructor(version?: CommentVersion) {
    this.version = structuredClone(version) ?? {};
  }

  withId(id: number): CommentVersionBuilder {
    this.version.id = id;
    return this;
  }

  withContent(content: string): CommentVersionBuilder {
    this.version.content = content;
    return this;
  }

  withVersion(version: number): CommentVersionBuilder {
    this.version.version = version;
    return this;
  }

  withAuthorHash(authorHash: string): CommentVersionBuilder {
    this.version.authorHash = authorHash;
    return this;
  }

  withAuthorNickname(authorNickname: string): CommentVersionBuilder {
    this.version.authorNickname = authorNickname;
    return this;
  }

  withReason(reason: string): CommentVersionBuilder {
    this.version.reason = reason;
    return this;
  }

  withLatest(latest: boolean): CommentVersionBuilder {
    this.version.latest = latest;
    return this;
  }

  withTimestamp(timestamp: Date): CommentVersionBuilder {
    this.version.timestamp = timestamp;
    return this;
  }

  withComment(comment: Comment): CommentVersionBuilder {
    this.version.comment = comment;
    return this;
  }

  withCommentId(commentId: number): CommentVersionBuilder {
    this.version.commentId = commentId;
    return this;
  }

  withModerations(
    moderations: CommentModeration[] | Partial<CommentModeration[]>,
  ): CommentVersionBuilder {
    this.version.moderations = moderations;
    return this;
  }

  build(): Partial<CommentVersion> {
    return this.version;
  }
}

class CommentModerationBuilder {
  private moderation: Partial<
    CommentModeration & {
      commentVersion: Partial<CommentVersion> & {
        comment: Partial<Comment> | undefined;
      };
    }
  > = {};

  constructor(moderation?: CommentModeration) {
    this.moderation = structuredClone(moderation) ?? {};
  }

  withId(id: number): CommentModerationBuilder {
    this.moderation.id = id;
    return this;
  }

  withComment(comment: Comment): CommentModerationBuilder {
    this.moderation.commentVersion.comment = comment;
    return this;
  }

  withCommentVersion(
    commentVersion: CommentVersion & { comment: Partial<Comment> | undefined },
  ): CommentModerationBuilder {
    this.moderation.commentVersion = commentVersion;
    return this;
  }

  withCommentVersionId(commentVersionId: number): CommentModerationBuilder {
    this.moderation.commentVersionId = commentVersionId;
    return this;
  }

  withModeratorHash(moderatorHash: string): CommentModerationBuilder {
    this.moderation.moderatorHash = moderatorHash;
    return this;
  }

  withModeratorNickname(moderatorNickname: string): CommentModerationBuilder {
    this.moderation.moderatorNickname = moderatorNickname;
    return this;
  }

  withDecision(decision: Decision): CommentModerationBuilder {
    this.moderation.decision = decision;
    return this;
  }

  withReason(reason: string): CommentModerationBuilder {
    this.moderation.reason = reason;
    return this;
  }

  withTimestamp(timestamp: Date): CommentModerationBuilder {
    this.moderation.timestamp = timestamp;
    return this;
  }

  build(): Partial<CommentModeration> {
    return this.moderation;
  }
}

export { CommentBuilder, CommentVersionBuilder, CommentModerationBuilder };
