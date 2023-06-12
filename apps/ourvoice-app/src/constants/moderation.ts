export const LIST_TABS = [
  { name: 'Pending', current: true },
  { name: 'Accepted', current: false },
  { name: 'Rejected', current: false }
]

export const MODERATION_ACTIONS = [
  {
    name: 'Accept',
    icon: 'fa-check',
    placeholder: 'Moderation reason (optional)...',
    validate: false
  },
  {
    name: 'Modify',
    icon: 'fa-edit',
    placeholder: 'Moderation reason (required)...',
    validate: true
  },
  {
    name: 'Reject',
    icon: 'fa-xmark',
    placeholder: 'Moderation reason (required)...',
    validate: true
  }
]