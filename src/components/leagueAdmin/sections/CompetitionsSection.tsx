import { useState, type FormEvent } from 'react'
import { Plus, Save, ShieldCheck } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_COMPETITIONS, LEAGUE_RULES, type CompetitionProfileWithScope } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

type RuleValues = Record<string, string | boolean>

const formatOptions = [
  { value: 'league', label: 'League' },
  { value: 'group-stage', label: 'Group stage' },
  { value: 'knockout', label: 'Knockout' },
  { value: 'combined', label: 'Combined' },
]

export function CompetitionsSection({ search, onAction }: LeagueSectionProps) {
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [format, setFormat] = useState('league')
  const [season, setSeason] = useState('2025/26')
  const [rules, setRules] = useState<RuleValues>(() =>
    Object.fromEntries(LEAGUE_RULES.flatMap((group) => group.settings.map((setting) => [setting.id, setting.value]))),
  )

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Competition creation is a frontend preview; no competition was created.')
    setName('')
    setShortName('')
  }

  const rows = LEAGUE_COMPETITIONS.filter(
    (competition) => !search || competition.name.toLowerCase().includes(search.toLowerCase()) || competition.format.toLowerCase().includes(search.toLowerCase()),
  )
  const visibleRules = LEAGUE_RULES.filter((group) => !search || group.competition.toLowerCase().includes(search.toLowerCase()))

  const columns: TableColumn<CompetitionProfileWithScope>[] = [
    { key: 'name', header: 'Competition', cell: (row) => <p className="font-semibold text-ink">{row.name}</p> },
    { key: 'format', header: 'Format', cell: (row) => <span className="text-xs text-ink-muted capitalize">{row.format.replace(/-/g, ' ')}</span> },
    { key: 'season', header: 'Season', cell: (row) => <span className="text-xs text-ink-muted">{row.season}</span> },
    { key: 'round', header: 'Current round', cell: (row) => <span className="text-xs text-ink-muted">{row.currentRound}</span> },
    { key: 'teams', header: 'Teams', cell: (row) => <span className="text-xs text-ink-muted">{row.participants.length}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Competition rule configuration is a frontend preview.')}>Configure</Button> },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Competition creation" description="Create a new competition inside your assigned scope." className="xl:col-span-2">
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <FormField label="Competition name" name="league-competition-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Lesotho Super Cup" required />
            <FormField label="Short name" name="league-competition-short" value={shortName} onChange={(event) => setShortName(event.target.value)} placeholder="e.g. Super Cup" required />
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Format</p>
              <Select options={formatOptions} value={format} onChange={(value) => setFormat(value)} ariaLabel="Competition format" />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Season</p>
              <Select options={[{ value: '2025/26', label: '2025/26' }, { value: '2024/25', label: '2024/25' }]} value={season} onChange={setSeason} ariaLabel="Competition season" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<Plus className="size-4" aria-hidden />}>Preview competition</Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel title="Scope control" description="Built-in safeguards for this workspace.">
          <div className="space-y-3">
            {[
              'Only assigned competitions are listed.',
              'New competitions inherit the administrator scope.',
              'Rule changes are previewed before publication.',
              'Unassigned competitions remain hidden.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Assigned competitions" description="The full competition portfolio available to this administrator." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Assigned competitions" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleRules.map((group) => (
          <AdminPanel
            key={group.id}
            title={group.title}
            description={`Competition rules for ${group.competition}.`}
            actions={
              <Button variant="outline" size="sm" iconLeft={<Save className="size-3.5" aria-hidden />} onClick={() => onAction('Rule configuration is a frontend preview; nothing was saved.')}>
                Save rules
              </Button>
            }
          >
            <div className="space-y-4">
              {group.settings.map((setting) => (
                <div key={setting.id} className="rounded-lg border border-line bg-surface-muted p-3.5">
                  {typeof setting.value === 'boolean' ? (
                    <label className="flex cursor-pointer items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-ink">{setting.label}</span>
                        <span className="caption mt-1 block">{setting.description}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(rules[setting.id])}
                        onChange={(event) => setRules((current) => ({ ...current, [setting.id]: event.target.checked }))}
                        aria-label={setting.label}
                        className="mt-0.5 size-4 shrink-0 rounded border-line-strong text-primary"
                      />
                    </label>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-ink">{setting.label}</p>
                      <p className="caption mt-1">{setting.description}</p>
                      <div className="mt-3">
                        <Select
                          options={(setting.options ?? [setting.value]).map((option) => ({ value: option, label: option }))}
                          value={String(rules[setting.id] ?? setting.value)}
                          onChange={(value) => setRules((current) => ({ ...current, [setting.id]: value }))}
                          ariaLabel={setting.label}
                          size="sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </AdminPanel>
        ))}
      </div>
    </>
  )
}
