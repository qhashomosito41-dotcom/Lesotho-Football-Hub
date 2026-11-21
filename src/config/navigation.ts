import { ROUTES } from './app'

export interface NavDropdownEntry {
  label: string
  to: string
  caption?: string
  end?: boolean
}

export type NavEntry =
  | { kind: 'link'; label: string; to: string; end?: boolean }
  | { kind: 'dropdown'; label: string; items: NavDropdownEntry[] }

export const MAIN_NAV: NavEntry[] = [
  { kind: 'link', label: 'Home', to: ROUTES.home, end: true },
  { kind: 'link', label: 'Live Scores', to: ROUTES.liveScores },
  { kind: 'link', label: 'Fixtures', to: ROUTES.fixtures },
  { kind: 'link', label: 'Results', to: ROUTES.results },
  { kind: 'link', label: 'Standings', to: ROUTES.standings },
  {
    kind: 'dropdown',
    label: 'Competitions',
    items: [
      { label: 'All competitions', to: ROUTES.competitions, caption: 'Every national competition', end: true },
      { label: 'Vodacom Premier League', to: ROUTES.premierLeague },
      { label: 'Lesotho Championship', to: ROUTES.championship },
      { label: 'LNFA Knockout Cup', to: ROUTES.knockoutCup },
    ],
  },
  { kind: 'link', label: 'Clubs', to: ROUTES.clubs },
  { kind: 'link', label: 'Players', to: ROUTES.players },
  { kind: 'link', label: 'Top Scorers', to: ROUTES.topScorers },
  {
    kind: 'dropdown',
    label: 'Statistics',
    items: [
      { label: 'Overview', to: ROUTES.statistics, end: true },
      { label: 'Player statistics', to: ROUTES.playerStatistics, caption: 'Goals, assists, appearances' },
      { label: 'Team statistics', to: ROUTES.teamStatistics, caption: 'Scoring, defence, discipline' },
    ],
  },
  { kind: 'link', label: 'Transfers', to: ROUTES.transfers },
]

export const FOOTER_COMPETITION_LINKS: NavDropdownEntry[] = [
  { label: 'All competitions', to: ROUTES.competitions, end: true },
  { label: 'Vodacom Premier League', to: ROUTES.premierLeague },
  { label: 'Lesotho Championship', to: ROUTES.championship },
  { label: 'LNFA Knockout Cup', to: ROUTES.knockoutCup },
]

export const FOOTER_CLUB_LINKS: { label: string; to: string }[] = [
  { label: 'Club directory', to: ROUTES.clubs },
  { label: 'Matlama FC', to: '/clubs/matlama' },
  { label: 'Bantu FC', to: '/clubs/bantu' },
  { label: 'Lioli FC', to: '/clubs/lioli' },
  { label: 'LMPS FC', to: '/clubs/lmps' },
]
