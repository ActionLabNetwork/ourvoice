import type {
  ModerationComment,
  ModerationCommentParent,
  ModerationCommentParentVersion,
  ModerationCommentVersion
} from '@/stores/comment-moderation'

export const isModerationComment = (
  comment: ModerationComment | ModerationCommentParent
): comment is ModerationComment => {
  return (comment as ModerationComment)!.versions[0].moderations !== undefined
}

export const isModerationCommentVersion = (
  version: ModerationCommentVersion | ModerationCommentParentVersion
): version is ModerationCommentVersion => {
  return (version as ModerationCommentVersion)!.moderations !== undefined
}
