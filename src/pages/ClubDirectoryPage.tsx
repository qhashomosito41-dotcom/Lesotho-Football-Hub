import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { Button, Card, CardBody, ClubBadge, EmptyState, SearchField, Select } from '@/components/ui'
import { clubPath } from '@/config/homepage'
import { CLUB_LIST, clubCompetitionOptions } from '@/config/clubs'

export default function ClubDirectoryPage() {
  const [query, setQuery] = useState('')
  const [competition, setCompetition] = useState('all')

  const clubs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return CLUB_LIST.filter((club) => {
      const matches =
        needle.length === 0 ||
        club.name.toLowerCase().includes(needle) ||
        club.district.toLowerCase().includes(needle) ||
        club.competition.toLowerCase().includes(needle)
      return matches && (competition === 'all' || club.competitionId === competition)
    }).sort((first, second) => first.name.localeCompare(second.name))
  }, [query, competition])

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Club directory</p>
        <h1 className="page-title mt-2 text-white">Clubs</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Search every club by name or district, then open a profile for squads, results and statistics.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_260px]">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search clubs by name or district…"
            ariaLabel="Search clubs"
            size="lg"
          />
          <Select
            options={[{ value: 'all', label: 'All competitions' }, ...clubCompetitionOptions()]}
            value={competition}
            onChange={setCompetition}
            ariaLabel="Filter clubs by competition"
            size="lg"
          />
        </div>

        <p className="caption mt-5 text-navy-400">
          {clubs.length} {clubs.length === 1 ? 'club' : 'clubs'} · demonstration data
        </p>

        {clubs.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <Link key={club.id} to={clubPath(club.id)} className="group">
                <Card raised className="h-full transition-transform duration-150 group-hover:-translate-y-0.5">
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <ClubBadge
                        name={club.name}
                        shortName={club.shortName}
                        color={club.color}
                        size="lg"
                      />
                      <div className="min-w-0">
                        <h2 className="truncate font-display text-lg font-bold text-ink">{club.name}</h2>
                        <p className="caption flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" aria-hidden />
                          {club.district}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {club.competition}
                      </span>
                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-ink-muted">
                        Est. {club.established}
                      </span>
                    </div>
                    <p className="caption mt-4 border-t border-line pt-3">{club.stadium}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No clubs found"
              description="Try another name, district or competition."
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setQuery('')
                    setCompetition('all')
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}
