import { DemoNotice } from '@/components/home/DemoNotice'
import { FeaturedClubsSection } from '@/components/home/FeaturedClubsSection'
import { FixturesSection } from '@/components/home/FixturesSection'
import { HomeHero } from '@/components/home/HomeHero'
import { LiveMatchesSection } from '@/components/home/LiveMatchesSection'
import { NewsSection } from '@/components/home/NewsSection'
import { ResultsSection } from '@/components/home/ResultsSection'
import { StandingsSection } from '@/components/home/StandingsSection'
import { TopScorersSection } from '@/components/home/TopScorersSection'
import { UpcomingCompetitionsSection } from '@/components/home/UpcomingCompetitionsSection'

export default function HomePage() {
  return (
    <>
      <DemoNotice />
      <HomeHero />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:space-y-14 lg:py-14">
        <LiveMatchesSection />

        <div className="grid gap-8 lg:grid-cols-2">
          <FixturesSection />
          <ResultsSection />
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <StandingsSection className="lg:col-span-7" />
          <TopScorersSection className="lg:col-span-5" />
        </div>

        <FeaturedClubsSection />

        <div className="grid gap-8 lg:grid-cols-12">
          <NewsSection className="lg:col-span-7" />
          <UpcomingCompetitionsSection className="lg:col-span-5" />
        </div>
      </div>
    </>
  )
}
