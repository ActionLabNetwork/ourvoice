export const createPostTitleCharacterLimit = 100
export const createPostContentCharacterLimit = 255
export const allowedFileTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif'
]
export const maxCategories = 2
export const maxAttachmentFilesSize = 2 * 1024 * 1024 // 2MB
export const postFilesBucket = 'test-bucket'
export const postFilesPresignedUrlTTL = 5 * 60 // 5 Minutes

export const inputPlaceholders = {
  title: 'Share your thoughts anonymously',
  content: 'I have an idea for improving...',
  categories: 'Select categories'
}
export type sortOptions =
  | 'sortByCreatedAt'
  | 'sortByCommentsCount'
  | 'sortByVotesDown'
  | 'sortByVotesUp'
export type sortOrder = 'asc' | 'desc'
