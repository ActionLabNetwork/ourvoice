import {
  Comment,
  CommentVersion,
  CommentModeration,
} from '../../../node_modules/@internal/prisma/client';
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
