import type { ModerationAction, ModerationListTabs } from './../types/moderation'
import { faCheck, faEdit, faXmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

export const LIST_TABS: ModerationListTabs = [
  { name: 'Pending', current: true },
  { name: 'Approved', current: false },
  { name: 'Rejected', current: false }
]

type ModerationActionButton = {
  name: ModerationAction
  icon: IconDefinition
  placeholder: `Moderation reason (${'optional' | 'required'})...`
  validate: boolean
}
export const MODERATION_ACTIONS: readonly ModerationActionButton[] = [
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
] as const

export const MODERATION_LIST_POSTS_PER_PAGE = 10
export const MODERATION_LIST_COMMENTS_PER_PAGE = 10
