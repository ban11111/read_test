export interface Notice {
  type: NoticeType
  text: React.ReactNode
  duration: number
  key?: string
  onClose?: () => void
}

export type NoticeType = 'success' | 'error' | 'info' | 'warning'
