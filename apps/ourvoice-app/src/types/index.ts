export interface Tab {
  name: string
  current: boolean
}

export type ToggleItems = {
  [K in 'left' | 'right']: {
    label: string
    iconLight?: string
    iconDark?: string
    hasUpdates: boolean
  }
}
