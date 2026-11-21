import { LeagueTable } from '@/components/ui'
import { clubPath } from '@/config/homepage'
import { calculateCompetitionTable, type CompetitionResult, type Group } from '@/config/competitions'

interface GroupTablesProps {
  groups: Group[]
  results: CompetitionResult[]
}

export function GroupTables({ groups, results }: GroupTablesProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {groups.map((group) => {
        const rows = calculateCompetitionTable(group.teams, results.filter((result) => result.group === group.name)).map(
          (row) => ({ ...row, to: clubPath(row.team.id) }),
        )

        return (
          <section key={group.name} aria-label={`${group.name} standings`}>
            <div className="mb-3 flex items-baseline justify-between border-b border-line pb-2">
              <h3 className="font-display text-lg font-bold text-ink">{group.name}</h3>
              <span className="caption">{group.teams.length} clubs</span>
            </div>
            <LeagueTable rows={rows} showGoals caption={`${group.name} standings`} />
          </section>
        )
      })}
    </div>
  )
}
