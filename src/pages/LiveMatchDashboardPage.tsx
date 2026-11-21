import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfirmDialog, LiveMatchLayout } from '@/components/liveMatch'
import {
  EventControlsSection,
  GoalEntrySection,
  MatchControlSection,
  MatchOverviewSection,
  SubstitutionEntrySection,
  TimelineSection,
  type ConfirmAction,
  type LiveMatchSectionProps,
  type NewTimelineEvent,
} from '@/components/liveMatch/sections'
import { Button, Modal, useToast } from '@/components/ui'
import { FormField as AuthFormField } from '@/components/auth'
import {
  INITIAL_TIMELINE,
  LIVE_MATCH,
  LIVE_MATCH_SECTION_META,
  isLiveMatchSection,
  timelineLabel,
  type AccessScope,
  type LiveEventType,
  type LiveMatchSectionId,
  type LiveTimelineEvent,
} from '@/config/liveMatch'

export default function LiveMatchDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const section: LiveMatchSectionId = isLiveMatchSection(requestedSection) ? requestedSection : 'overview'
  const scope: AccessScope = searchParams.get('view') === 'official' ? 'official' : 'representative'
  const [search, setSearch] = useState('')
  const [goalPreset, setGoalPreset] = useState('')
  const [score, setScore] = useState({ home: LIVE_MATCH.homeScore, away: LIVE_MATCH.awayScore })
  const [minute, setMinute] = useState(LIVE_MATCH.minute)
  const [phase, setPhase] = useState('Second half')
  const [events, setEvents] = useState<LiveTimelineEvent[]>(INITIAL_TIMELINE)
  const [confirmation, setConfirmation] = useState<ConfirmAction | null>(null)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [correctionNote, setCorrectionNote] = useState('')
  const { info, success } = useToast()
  const meta = LIVE_MATCH_SECTION_META[section]

  const notify = (message: string) => {
    info('Frontend preview', message)
  }

  const changeSection = (next: LiveMatchSectionId, preset?: string) => {
    setGoalPreset(preset ?? '')
    setSearchParams({
      section: next,
      ...(scope === 'official' ? { view: 'official' } : {}),
    })
    setSearch('')
  }

  const requestConfirmation = (action: ConfirmAction) => {
    setConfirmation({
      ...action,
      onConfirm: () => {
        action.onConfirm()
        success('Frontend confirmation', `${action.confirmLabel ?? action.title} recorded in this preview.`)
      },
    })
  }

  const recordEvent = (event: NewTimelineEvent) => {
    const nextEvent: LiveTimelineEvent = {
      ...event,
      id: `live-${Date.now()}-${events.length}`,
      origin: 'live',
    }

    setEvents((current) =>
      [...current, nextEvent].sort(
        (first, second) => first.minute - second.minute || (first.additionalTime ?? 0) - (second.additionalTime ?? 0),
      ),
    )

    setScore((current) => {
      if (event.type === 'goal') {
        return event.side === 'home'
          ? { ...current, home: current.home + 1 }
          : { ...current, away: current.away + 1 }
      }
      if (event.type === 'own-goal') {
        return event.side === 'home'
          ? { ...current, away: current.away + 1 }
          : { ...current, home: current.home + 1 }
      }
      if (event.type === 'penalty-scored') {
        return event.side === 'home'
          ? { ...current, home: current.home + 1 }
          : { ...current, away: current.away + 1 }
      }
      return current
    })
  }

  const updatePhase = (nextPhase: string, eventType: LiveEventType, detail: string) => {
    setPhase(nextPhase)
    setEvents((current) => [
      ...current,
      {
        id: `phase-${Date.now()}`,
        minute,
        type: eventType,
        label: timelineLabel(eventType),
        detail,
        origin: 'live',
      },
    ])
  }

  const submitCorrection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEvents((current) => [
      ...current,
      {
        id: `correction-${Date.now()}`,
        minute,
        type: 'correction',
        label: 'Correction requested',
        detail: correctionNote,
        origin: 'live',
      },
    ])
    setCorrectionOpen(false)
    setCorrectionNote('')
    success('Correction requested', 'The correction request was added to the live timeline preview.')
  }

  const sectionProps: LiveMatchSectionProps = {
    scope,
    score,
    minute,
    phase,
    events,
    search,
    goalPreset,
    onNavigate: changeSection,
    onConfirm: requestConfirmation,
    onRecord: recordEvent,
    onSetMinute: setMinute,
    onSetPhase: updatePhase,
    onCorrection: () => setCorrectionOpen(true),
    onPreview: notify,
  }

  const renderSection = () => {
    switch (section) {
      case 'events':
        return <EventControlsSection {...sectionProps} />
      case 'goal':
        return <GoalEntrySection {...sectionProps} />
      case 'substitution':
        return <SubstitutionEntrySection {...sectionProps} />
      case 'control':
        return <MatchControlSection {...sectionProps} />
      case 'timeline':
        return <TimelineSection {...sectionProps} />
      case 'overview':
      default:
        return <MatchOverviewSection {...sectionProps} />
    }
  }

  return (
    <>
      <LiveMatchLayout
        section={section}
        onSectionChange={changeSection}
        scope={scope}
        title={meta.title}
        description={meta.description}
        searchValue={search}
        onSearchChange={section === 'timeline' ? setSearch : undefined}
        searchPlaceholder="Search match events…"
      >
        {renderSection()}
      </LiveMatchLayout>

      <ConfirmDialog action={confirmation} onClose={() => setConfirmation(null)} />

      <Modal
        open={correctionOpen}
        onClose={() => setCorrectionOpen(false)}
        title="Request correction"
        description="Explain what should be reviewed in the live match record."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCorrectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="correction-form" variant="outline">
              Submit request
            </Button>
          </>
        }
      >
        <form id="correction-form" onSubmit={submitCorrection} className="space-y-3">
          <AuthFormField
            label="Correction reason"
            name="correction-note"
            value={correctionNote}
            onChange={(event) => setCorrectionNote(event.target.value)}
            placeholder="Describe the event that needs review"
            required
          />
          <p className="caption">This creates a preview correction entry only; no league office record is changed.</p>
        </form>
      </Modal>
    </>
  )
}
