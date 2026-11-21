import type { AccessScope, LiveEventType, LiveMatchSectionId, LiveTimelineEvent } from '@/config/liveMatch'

export interface ConfirmAction {
  title: string
  description: string
  details?: { label: string; value: string }[]
  confirmLabel?: string
  tone?: 'primary' | 'danger' | 'success'
  onConfirm: () => void
}

export type NewTimelineEvent = Pick<LiveTimelineEvent, 'minute' | 'type' | 'side' | 'label' | 'detail' | 'additionalTime'>

export interface LiveMatchSectionProps {
  scope: AccessScope
  score: { home: number; away: number }
  minute: number
  phase: string
  events: LiveTimelineEvent[]
  search: string
  goalPreset?: string
  onNavigate: (section: LiveMatchSectionId, goalPreset?: string) => void
  onConfirm: (action: ConfirmAction) => void
  onRecord: (event: NewTimelineEvent) => void
  onSetMinute: (minute: number) => void
  onSetPhase: (phase: string, eventType: LiveEventType, detail: string) => void
  onCorrection: () => void
  onPreview: (message: string) => void
}
