export type ModerationStatus = 'Pending' | 'Approved' | 'Rejected'
export type ModerationVersionStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type ModerationVersionDecision = 'ACCEPTED' | 'REJECTED'
export type ModerationVersionDecisionHistory = ModerationVersionDecision | 'MODIFIED'
export type ModerationActions = 'Accept' | 'Modify' | 'Reject'
export interface ModeratedPostNicknames {
  author: {
    nickname: string
    parts: {
      first: string
      middle: string
      last: string
    }
  }
  moderator: {
    nickname: string
    parts: {
      first: string
      middle: string
      last: string
    }
  }
}

export interface Moderation {
  id: any
  decision: any
  reason: any
  timestamp: any
  moderatorHash: any
  moderatorNickname: any
}

export type ModerationListTab = { name: ModerationStatus; current: boolean }
export type ModerationListTabs = ModerationListTab[]
