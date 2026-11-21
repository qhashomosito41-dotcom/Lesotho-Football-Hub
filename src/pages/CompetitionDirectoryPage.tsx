import { DemoNotice } from '@/components/home/DemoNotice'
import { ButtonLink, Card, CardBody, EmptyState } from '@/components/ui'
import { CompetitionLogo } from '@/components/competitions'
import { COMPETITION_PROFILES, competitionPath, competitionTypeName } from '@/config/competitions'
import { ROUTES } from '@/config/app'

export default function CompetitionDirectoryPage() {
  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Competitions</p>
        <h1 className="page-title mt-2 text-white">Competitions</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Explore leagues, group-stage events, knockout cups and combined tournaments across Lesotho.
        </p>
        <p className="caption mt-5 text-navy-400">{COMPETITION_PROFILES.length} competitions · demonstration data</p>

        {COMPETITION_PROFILES.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITION_PROFILES.map((competition) => (
              <ButtonLink
                key={competition.id}
                to={competitionPath(competition)}
                variant="secondary"
                className="h-full w-full justify-start p-0"
              >
                <Card raised className="h-full w-full border-transparent">
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      <CompetitionLogo competition={competition} size="md" />
                      <div className="min-w-0">
                        <h2 className="truncate font-display text-lg font-bold text-ink">{competition.name}</h2>
                        <p className="caption">{competition.typeLabel}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
                      <div>
                        <p className="eyebrow">Season</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{competition.season}</p>
                      </div>
                      <div>
                        <p className="eyebrow">Status</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{competition.status}</p>
                      </div>
                      <div>
                        <p className="eyebrow">Clubs</p>
                        <p className="mt-1 text-sm font-semibold text-ink">{competition.participants.length}</p>
                      </div>
                      <div>
                        <p className="eyebrow">Format</p>
                        <p className="mt-1 text-xs font-semibold text-ink">{competitionTypeName(competition.format)}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </ButtonLink>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState tone="dark" title="No competitions found" description="Competition records will appear here." />
          </div>
        )}

        <div className="mt-8 rounded-xl border border-navy-700 bg-elevated p-5">
          <h2 className="font-display text-lg font-bold text-white">Need another section?</h2>
          <p className="body-muted mt-2 text-sm text-navy-200">
            Browse clubs and players from the main navigation, or return to the latest scores.
          </p>
          <ButtonLink to={ROUTES.liveScores} variant="primary" size="sm" className="mt-4">
            Live scores
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
