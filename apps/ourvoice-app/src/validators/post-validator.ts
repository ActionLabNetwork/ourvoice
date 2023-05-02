import { createPostTitleCharacterLimit, createPostContentCharacterLimit } from "@/constants/post"
import { defineRule } from "vee-validate"

export const validateTitle = (value: string) => {
  if (!value) return 'This field is required'
  if (value.length > 100)
    return `Title must not exceed ${createPostTitleCharacterLimit} characters.`

  const regex = /^[a-zA-Z0-9\s]*$/
  if (!regex.test(value)) return 'Title must only contain alphanumeric characters.'

  return true
}

export const validateContent = (value: string) => {
  if (!value) return 'This field is required'
  if (value.length > 100)
    return `Content must not exceed ${createPostContentCharacterLimit} characters.`

  const regex = /^[a-zA-Z0-9\s]*$/
  if (!regex.test(value)) return 'Content must only contain alphanumeric characters.'

  return true
}

export const validateCategories = (value: any) => {
  if (!value || value.length < 1) {
    return 'Please select at least one category.'
  }
  if (value.length > 2) {
    return 'Please select no more than two categories.'
  }
  return true
}

const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf']
const maxFileSize = 2 * 1024 * 1024 // 2MB

export const validateAttachments = (files: FileList) => {
  if (!files) {
    return true // No file selected, so validation passes
  }

  for (const file of files) {
    if (!allowedFileTypes.includes(file.type)) {
      return `Allowed file types are: ${allowedFileTypes.join(', ')}`
    }
    if (file.size > maxFileSize) {
      return `File size must be under ${maxFileSize / (1024 * 1024)}MB`
    }
  }

  return true
}

defineRule('validateTitle', validateTitle)
defineRule('validateContent', validateContent)
defineRule('validateCategories', validateCategories)
defineRule('validateAttachments', validateAttachments)
