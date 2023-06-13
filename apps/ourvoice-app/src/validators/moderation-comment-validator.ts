import {
  createPostTitleCharacterLimit,
  createPostContentCharacterLimit,
  maxCategories,
  allowedFileTypes,
  maxAttachmentFilesSize
} from '@/constants/post'

export const validateModerationReason = (value: string) => {
  if (value && value.trim()) {
    return true
  }

  return 'Moderation reason is required'
}

export const validateContent = (value: string) => {
  if (!value || !value.trim()) return 'This field is required'
  if (value.length > createPostContentCharacterLimit)
    return `Content must not exceed ${createPostContentCharacterLimit} characters.`

  return true
}
