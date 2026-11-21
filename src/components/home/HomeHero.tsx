import { ArrowRight, Radio } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { APP_SHORT_NAME, ROUTES } from '@/config/app'

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-canvas bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.14),transparent_55%)]">
      <svg
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[440px] w-[440px] -translate-y-1/2 text-white/[0.05] lg:block"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="200" cy="200" r="198" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="8" fill="currentColor" stroke="none" />
        <path d="M200 2v396M2 200h396" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <p className="eyebrow text-green-400">Lesotho's national football platform</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.02] tracking-wide text-white sm:text-5xl lg:text-6xl">
            The home of Lesotho football
          </h1>
          <p className="body-muted mt-4 max-w-2xl text-base text-navy-200">
            Live scores, fixtures, results, league tables, clubs, players and statistics — one connected
            platform for every competition in Lesotho.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink
              to={ROUTES.competitions}
              size="lg"
              variant="primary"
              iconRight={<ArrowRight className="size-5" aria-hidden />}
            >
              Explore Competitions
            </ButtonLink>
            <ButtonLink
              to={ROUTES.liveScores}
              size="lg"
              variant="success"
              iconLeft={<Radio className="size-5" aria-hidden />}
            >
              View Live Matches
            </ButtonLink>
          </div>
        </div>

        <p className="mt-8 text-[11px] font-semibold tracking-[0.16em] text-navy-400 uppercase">
          {APP_SHORT_NAME} · One platform · All competitions · Every club · Every player · Every match
        </p>
      </div>
    </section>
  )
}
