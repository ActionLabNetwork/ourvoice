import type { ModerationListTabs } from './../types/moderation'
import {faCheck, faEdit, faXmark} from '@fortawesome/free-solid-svg-icons'

export const LIST_TABS: ModerationListTabs = [
  { name: 'Pending', current: true },
  { name: 'Approved', current: false },
  { name: 'Rejected', current: false }
]

export const MODERATION_ACTIONS = [
  {
    name: 'Accept',
    icon: faCheck,
    placeholder: 'Moderation reason (optional)...',
    validate: false
  },
  {
    name: 'Modify',
    icon: faEdit,
    placeholder: 'Moderation reason (required)...',
    validate: true
  },
  {
    name: 'Reject',
    icon: faXmark,
    placeholder: 'Moderation reason (required)...',
    validate: true
  }
]

export const MODERATION_LIST_POSTS_PER_PAGE = 10
export const MODERATION_LIST_COMMENTS_PER_PAGE = 10
