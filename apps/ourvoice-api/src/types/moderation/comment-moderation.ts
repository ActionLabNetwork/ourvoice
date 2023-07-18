import {
  Comment,
  CommentVersion,
  CommentModeration,
} from '@internals/@prisma-moderation-db/client';
import { GetManyResponse } from '../general';

export type ModerationCommentsResponse = GetManyResponse<Comment>;

export type CommentVersionIncludesModerations = CommentVersion & {
  moderations: CommentModeration[];
};

export type CommentIncludesVersionIncludesModerations = Comment & {
  versions: CommentVersionIncludesModerations[];
};

export type CommentIncludesVersion = Comment & { versions: CommentVersion[] };

export type ModerationIncludesVersion = CommentModeration & {
  commentVersion: CommentVersion;
};

export type ModerationIncludesVersionIncludesComment = CommentModeration & {
  commentVersion: CommentVersion & { comment: Comment };
};
