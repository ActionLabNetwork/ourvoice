import {
  Post,
  PostVersion,
  PostModeration,
} from '@prisma-moderation-db/client';
import { GetManyResponse } from '../general';

export type ModerationPostsResponse = GetManyResponse<Post>;

export type PostVersionIncludesModerations = PostVersion & {
  moderations: PostModeration[];
};

export type PostIncludesVersionIncludesModerations = Post & {
  versions: PostVersionIncludesModerations[];
};

export type PostIncludesVersion = Post & { versions: PostVersion[] };

export type ModerationIncludesVersion = PostModeration & {
  postVersion: PostVersion;
};
