import {
  Comment,
  CommentVersion,
  CommentModeration,
  PostStatus,
  Decision,
} from '@internal/prisma/client';

class CommentBuilder {
  private comment: Partial<
    Comment & {
      versions: CommentVersion[] & { moderations: CommentModeration[] };
    }
  > = {};

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
    versions: CommentVersion[] & { moderations: CommentModeration[] },
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

  build() {
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

  withStatus(status: PostStatus): CommentVersionBuilder {
    this.version.status = status;
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

  build() {
    return this.version;
  }
}

class CommentModerationBuilder {
  private moderation: Partial<
    CommentModeration & { commentVersion: Partial<CommentVersion> }
  > = {};

  withId(id: number): CommentModerationBuilder {
    this.moderation.id = id;
    return this;
  }

  withCommentVersion(commentVersion: CommentVersion): CommentModerationBuilder {
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

  build() {
    return this.moderation;
  }
}

export { CommentBuilder, CommentVersionBuilder, CommentModerationBuilder };
