import { Card } from '@/components/ui'
import type { MatchDetail } from '@/config/matches'

interface MatchInfoProps {
  match: MatchDetail
}

export function MatchInfo({ match }: MatchInfoProps) {
  const rows: { label: string; value: string }[] = [
    { label: 'Competition', value: match.competition },
    { label: 'Round', value: match.round },
    { label: 'Season', value: match.season },
    { label: 'Kick-off', value: match.kickoff ? `${match.date} · ${match.kickoff}` : match.date },
    { label: 'Venue', value: match.venue },
    { label: 'City', value: match.city },
    { label: 'Attendance', value: match.attendance === null ? 'Not published' : match.attendance.toLocaleString('en-LS') },
    { label: 'Referee', value: match.referee },
  ]

  return (
    <Card variant="dark" padding="default">
      <h2 className="section-title text-white">Match information</h2>
      <dl className="mt-4 divide-y divide-navy-700">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 py-2.5">
            <dt className="shrink-0 text-xs font-semibold tracking-wide text-navy-400 uppercase">{row.label}</dt>
            <dd className="min-w-0 text-right text-sm text-navy-100">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
