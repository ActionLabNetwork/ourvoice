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

export const validateTitle = (value: string) => {
  console.log('validating title')
  if (!value) return 'This field is required'
  if (value.length > createPostTitleCharacterLimit)
    return `Title must not exceed ${createPostTitleCharacterLimit} characters.`

  const regex = /^[a-zA-Z0-9\s]*$/
  if (!regex.test(value)) return 'Title must only contain alphanumeric characters.'

  return true
}

export const validateContent = (value: string) => {
  if (!value || !value.trim()) return 'This field is required'
  if (value.length > createPostContentCharacterLimit)
    return `Content must not exceed ${createPostContentCharacterLimit} characters.`

  return true
}

export const validateCategories = (value: any) => {
  if (!value || value.length < 1) {
    return 'Please select at least one category.'
  }
  if (value.length > maxCategories) {
    return 'Please select no more than two categories.'
  }
  return true
}

export const validateAttachments = (files: FileList | null) => {
  if (!files) {
    return true // No file selected, so validation passes
  }

  let totalSize = 0

  for (const file of files) {
    if (!allowedFileTypes.includes(file.type)) {
      return `Allowed file types are: ${allowedFileTypes.join(', ')}`
    }
    totalSize += file.size
  }

  if (totalSize > maxAttachmentFilesSize) {
    return `Total file size must be under ${maxAttachmentFilesSize / (1024 * 1024)}MB`
  }

  return true
}
