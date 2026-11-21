import { ROUTES } from './app'

export type SearchEntryKind = 'page' | 'competition' | 'club' | 'player'

export interface SearchEntry {
  title: string
  to: string
  kind: SearchEntryKind
  caption?: string
  keywords?: string
}

export const SEARCH_INDEX: SearchEntry[] = [
  { title: 'Home', to: ROUTES.home, kind: 'page', keywords: 'front page headlines' },
  { title: 'Live Scores', to: ROUTES.liveScores, kind: 'page', keywords: 'live realtime matches in progress' },
  { title: 'Fixtures', to: ROUTES.fixtures, kind: 'page', keywords: 'schedule kick-off upcoming matches' },
  { title: 'Results', to: ROUTES.results, kind: 'page', keywords: 'final scores full time archive' },
  { title: 'Standings', to: ROUTES.standings, kind: 'page', keywords: 'league table points position' },
  { title: 'Competitions', to: ROUTES.competitions, kind: 'page', keywords: 'leagues cup tournaments' },
  { title: 'Vodacom Premier League', to: ROUTES.premierLeague, kind: 'competition', caption: 'Competition', keywords: 'top division premier league table' },
  { title: 'Lesotho Championship', to: ROUTES.championship, kind: 'competition', caption: 'Competition', keywords: 'second division championship' },
  { title: 'LNFA Knockout Cup', to: ROUTES.knockoutCup, kind: 'competition', caption: 'Competition', keywords: 'cup knockout fa cup' },
  { title: 'Clubs', to: ROUTES.clubs, kind: 'page', keywords: 'directory teams squads' },
  { title: 'Matlama FC', to: '/clubs/matlama', kind: 'club', caption: 'Club', keywords: 'matlama premier league tšepe' },
  { title: 'Bantu FC', to: '/clubs/bantu', kind: 'club', caption: 'Club', keywords: 'bantu majita premier league' },
  { title: 'Lioli FC', to: '/clubs/lioli', kind: 'club', caption: 'Club', keywords: 'lioli tšepe division one' },
  { title: 'LMPS FC', to: '/clubs/lmps', kind: 'club', caption: 'Club', keywords: 'lmps police service' },
  { title: 'Players', to: ROUTES.players, kind: 'page', keywords: 'squads profiles squad players' },
  { title: 'Thabo Mokoena', to: '/players/matlama-1', kind: 'player', caption: 'Player', keywords: 'matlama forward striker' },
  { title: 'Tumelo Ramohapi', to: '/players/bantu-1', kind: 'player', caption: 'Player', keywords: 'bantu forward striker' },
  { title: 'Katleho Mofolo', to: '/players/matlama-2', kind: 'player', caption: 'Player', keywords: 'matlama midfielder' },
  { title: 'Top Scorers', to: ROUTES.topScorers, kind: 'page', keywords: 'goals golden boot scorers leaders' },
  { title: 'News', to: ROUTES.news, kind: 'page', keywords: 'news articles announcements headlines updates' },
  { title: 'Statistics', to: ROUTES.statistics, kind: 'page', keywords: 'stats data analytics' },
  { title: 'Player statistics', to: ROUTES.playerStatistics, kind: 'page', keywords: 'goals assists leaders top scorers' },
  { title: 'Team statistics', to: ROUTES.teamStatistics, kind: 'page', keywords: 'team goals conceded discipline' },
  { title: 'Transfer centre', to: ROUTES.transfers, kind: 'page', keywords: 'transfers signings registrations contracts arrivals departures loans free agents' },
  { title: 'Login', to: ROUTES.login, kind: 'page', keywords: 'sign in account admin' },
  { title: 'About', to: ROUTES.about, kind: 'page', keywords: 'about platform mission lfH' },
  { title: 'Contact', to: ROUTES.contact, kind: 'page', keywords: 'contact email phone address' },
  { title: 'Privacy Policy', to: ROUTES.privacy, kind: 'page', keywords: 'privacy data protection' },
  { title: 'Terms & Conditions', to: ROUTES.terms, kind: 'page', keywords: 'terms legal conditions' },
]

export function searchIndex(query: string, limit = 6): SearchEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return SEARCH_INDEX.filter((entry) => {
    const title = entry.title.toLowerCase()
    const keywords = entry.keywords?.toLowerCase() ?? ''
    const caption = entry.caption?.toLowerCase() ?? ''
    return (
      title.includes(needle) ||
      keywords.includes(needle) ||
      caption.includes(needle) ||
      entry.to.replace(/\//g, ' ').includes(needle)
    )
  }).slice(0, limit)
}
