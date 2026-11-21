import { AUTHORISED_CLUB_ID, isAuthorisedClub } from './clubDashboard'
import { MATCH_DETAILS, eventKindLabel, type MatchEvent, type MatchEventType } from './matches'

export type AccessScope = 'representative' | 'official'

export type LiveMatchSectionId =
  | 'overview'
  | 'events'
  | 'goal'
  | 'substitution'
  | 'control'
  | 'timeline'

export type LiveEventType =
  | MatchEventType
  | 'assist'
  | 'penalty-awarded'
  | 'penalty-scored'
  | 'penalty-missed'
  | 'injury'
  | 'start'
  | 'second-half'
  | 'extra-time'
  | 'shootout'
  | 'correction'

export interface LiveTimelineEvent {
  id: string
  minute: number
  additionalTime?: number
  type: LiveEventType
  side?: 'home' | 'away'
  label: string
  detail?: string
  origin: 'published' | 'live'
}

export type EventControlMode = 'goal' | 'own-goal' | 'substitution' | 'confirm'

export interface EventControlDefinition {
  id: string
  label: string
  description: string
  icon: string
  mode: EventControlMode
  eventType?: LiveEventType
  detail?: string
}

const SOURCE = MATCH_DETAILS['matlama-bantu']

export const LIVE_MATCH = {
  id: SOURCE.id,
  competition: SOURCE.competition,
  round: SOURCE.round,
  season: SOURCE.season,
  venue: SOURCE.venue,
  city: SOURCE.city,
  referee: SOURCE.referee,
  status: SOURCE.status,
  minute: SOURCE.minute ?? 63,
  homeScore: SOURCE.homeScore ?? 0,
  awayScore: SOURCE.awayScore ?? 0,
  home: SOURCE.home,
  away: SOURCE.away,
  homeLineup: SOURCE.homeLineup,
  awayLineup: SOURCE.awayLineup,
} as const

export const LIVE_MATCH_SECTION_IDS: LiveMatchSectionId[] = [
  'overview',
  'events',
  'goal',
  'substitution',
  'control',
  'timeline',
]

export const LIVE_MATCH_SECTION_META: Record<LiveMatchSectionId, { title: string; description: string }> = {
  overview: {
    title: 'Live match management',
    description: 'Official match record, score, clock, line-ups and authorised scope.',
  },
  events: {
    title: 'Event controls',
    description: 'Record the twelve standard live match events with confirmations.',
  },
  goal: {
    title: 'Goal entry',
    description: 'Capture scorer, assist, minute, additional time and goal type.',
  },
  substitution: {
    title: 'Substitution entry',
    description: 'Capture the player off, the player on and the exact match minute.',
  },
  control: {
    title: 'Match control',
    description: 'Manage the match clock and phases with confirmation dialogs.',
  },
  timeline: {
    title: 'Live event timeline',
    description: 'Chronological record of published and newly captured events.',
  },
}

export function isLiveMatchSection(value: string | null): value is LiveMatchSectionId {
  return Boolean(value && LIVE_MATCH_SECTION_IDS.some((section) => section === value))
}

export const SCOPE_COPY: Record<AccessScope, { label: string; note: string; badge: string }> = {
  representative: {
    label: `${LIVE_MATCH.home.name} representative`,
    note: `Representatives can record events only for ${LIVE_MATCH.home.name}. Opponent data is read-only.`,
    badge: 'Club representative',
  },
  official: {
    label: 'Designated match official',
    note: 'Match officials can record events for both teams in this assigned fixture.',
    badge: 'Match official',
  },
}

export const GOAL_TYPES = ['Regular goal', 'Header', 'Penalty', 'Free kick', 'Own goal'] as const

export const MATCH_PHASES = [
  'Pre-match',
  'First half',
  'Half-time',
  'Second half',
  'Extra time',
  'Penalty shootout',
  'Full-time',
] as const

export const EVENT_CONTROLS: EventControlDefinition[] = [
  { id: 'goal', label: 'Goal', description: 'Open the goal entry form.', icon: 'goal', mode: 'goal' },
  { id: 'own-goal', label: 'Own goal', description: 'Record a goal credited to the opposition.', icon: 'own-goal', mode: 'own-goal' },
  { id: 'assist', label: 'Assist', description: 'Record the final pass for a goal.', icon: 'assist', mode: 'confirm', eventType: 'assist', detail: 'Assist recorded in the match timeline.' },
  { id: 'yellow-card', label: 'Yellow card', description: 'Record a caution.', icon: 'yellow-card', mode: 'confirm', eventType: 'yellow-card', detail: 'Player caution issued.' },
  { id: 'red-card', label: 'Red card', description: 'Record a dismissal.', icon: 'red-card', mode: 'confirm', eventType: 'red-card', detail: 'Player dismissed.' },
  { id: 'substitution', label: 'Substitution', description: 'Open the substitution entry form.', icon: 'substitution', mode: 'substitution' },
  { id: 'penalty-awarded', label: 'Penalty awarded', description: 'Record a awarded spot kick.', icon: 'penalty', mode: 'confirm', eventType: 'penalty-awarded', detail: 'Penalty awarded.' },
  { id: 'penalty-scored', label: 'Penalty scored', description: 'Record a converted spot kick.', icon: 'penalty', mode: 'confirm', eventType: 'penalty-scored', detail: 'Penalty scored.' },
  { id: 'penalty-missed', label: 'Penalty missed', description: 'Record a missed spot kick.', icon: 'penalty', mode: 'confirm', eventType: 'penalty-missed', detail: 'Penalty missed.' },
  { id: 'injury', label: 'Injury', description: 'Record a stoppage for injury.', icon: 'injury', mode: 'confirm', eventType: 'injury', detail: 'Injury stoppage recorded.' },
  { id: 'half-time', label: 'Half-time', description: 'Close the first half.', icon: 'half-time', mode: 'confirm', eventType: 'half-time', detail: 'Half-time recorded.' },
  { id: 'full-time', label: 'Full-time', description: 'Close the match.', icon: 'full-time', mode: 'confirm', eventType: 'full-time', detail: 'Full-time recorded.' },
]

function toTimelineEvent(event: MatchEvent, index: number): LiveTimelineEvent {
  const type: LiveEventType = event.type === 'penalty' ? 'penalty-scored' : event.type
  const detail = event.detail ?? event.title

  return {
    id: `${event.id}-timeline-${index}`,
    minute: event.minute,
    type,
    side: event.team,
    label: event.title,
    detail,
    origin: 'published',
  }
}

export const INITIAL_TIMELINE: LiveTimelineEvent[] = [...SOURCE.events]
  .sort((first, second) => first.minute - second.minute)
  .map(toTimelineEvent)

export function teamForSide(side: 'home' | 'away') {
  return side === 'home' ? LIVE_MATCH.home : LIVE_MATCH.away
}

export function lineupForSide(side: 'home' | 'away') {
  return side === 'home' ? LIVE_MATCH.homeLineup : LIVE_MATCH.awayLineup
}

export function teamNameForSide(side: 'home' | 'away'): string {
  return teamForSide(side).name
}

export function canEditSide(scope: AccessScope, side: 'home' | 'away'): boolean {
  return scope === 'official' || (side === 'home' && isAuthorisedClub(teamForSide(side).id))
}

export function teamOptionsFor(scope: AccessScope) {
  return (['home', 'away'] as const)
    .filter((side) => canEditSide(scope, side))
    .map((side) => ({ value: side, label: `${teamNameForSide(side)} (${side})` }))
}

export function playerOptionsFor(side: 'home' | 'away', pool: 'starters' | 'substitutes' | 'all') {
  const lineup = lineupForSide(side)
  const players = pool === 'all' ? [...lineup.starters, ...lineup.substitutes] : lineup[pool]

  return players.map((player) => ({
    value: player.id,
    label: `${player.number}. ${player.name}${player.captain ? ' (C)' : ''}`,
  }))
}

export function playerNameFor(side: 'home' | 'away', playerId: string): string {
  const player = [...lineupForSide(side).starters, ...lineupForSide(side).substitutes].find((item) => item.id === playerId)
  return player?.name ?? 'Player'
}

export function formatMinute(minute: number, additionalTime = 0): string {
  return `${minute}${additionalTime > 0 ? `+${additionalTime}` : ''}'`
}

export function timelineLabel(type: LiveEventType): string {
  if (type === 'assist') return 'Assist'
  if (type === 'penalty-awarded') return 'Penalty awarded'
  if (type === 'penalty-scored') return 'Penalty scored'
  if (type === 'penalty-missed') return 'Penalty missed'
  if (type === 'injury') return 'Injury'
  if (type === 'start') return 'Match started'
  if (type === 'second-half') return 'Second half started'
  if (type === 'extra-time') return 'Extra time'
  if (type === 'shootout') return 'Penalty shootout'
  if (type === 'correction') return 'Correction requested'
  return eventKindLabel(type)
}

export function authorisedClubId(): string {
  return AUTHORISED_CLUB_ID
}
