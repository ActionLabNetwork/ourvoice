import {
  Post,
  Comment,
  CommentVersion,
  CommentModeration,
} from '@prisma-moderation-db/client';
import { GetManyResponse } from '../general';

export type ModerationCommentsResponse = GetManyResponse<Comment>;

export type WithIncluded<T, K extends string, V> = T & Record<K, V>;

export type CommentVersionIncludesModerations = WithIncluded<
  CommentVersion,
  'moderations',
  CommentModeration[]
>;

export type CommentIncludesVersion<T = CommentVersion> = WithIncluded<
  Comment,
  'versions',
  T[]
>;

export type CommentIncludesVersionIncludesModerations =
  CommentIncludesVersion<CommentVersionIncludesModerations>;

export type CommentIncludesVersionIncludesModerationsIncludesPost =
  WithIncluded<CommentIncludesVersionIncludesModerations, 'post', Post>;

export type ModerationIncludesVersion = WithIncluded<
  CommentModeration,
  'commentVersion',
  CommentVersion
>;

export type ModerationIncludesVersionIncludesComment = WithIncluded<
  ModerationIncludesVersion,
  'commentVersion',
  CommentVersion & { comment: Comment }
>;
