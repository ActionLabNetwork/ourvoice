import {
  Post,
  PostVersion,
  PostModeration,
} from '@prisma-moderation-db/client';
import { GetManyResponse } from '../general';

export type ModerationPostsResponse = GetManyResponse<Post>;

export type WithIncluded<T, K extends string, V> = T & Record<K, V>;

export type PostVersionIncludesModerations = WithIncluded<
  PostVersion,
  'moderations',
  PostModeration[]
>;

export type PostIncludesVersion<T = PostVersion> = WithIncluded<
  Post,
  'versions',
  T[]
>;

export type PostIncludesVersionIncludesModerations =
  PostIncludesVersion<PostVersionIncludesModerations>;

export type ModerationIncludesVersion = WithIncluded<
  PostModeration,
  'postVersion',
  PostVersion
>;
