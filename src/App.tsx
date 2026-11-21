import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard, AuthProvider } from '@/auth'
import { ToastProvider } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { PLACEHOLDER_PAGES } from '@/config/pages'
import PublicLayout from '@/layouts/PublicLayout'
import AcceptInvitationPage from '@/pages/AcceptInvitationPage'
import AccessDeniedPage from '@/pages/AccessDeniedPage'
import AccountInvitationPage from '@/pages/AccountInvitationPage'
import ClubDashboardPage from '@/pages/ClubDashboardPage'
import ClubDirectoryPage from '@/pages/ClubDirectoryPage'
import ClubProfilePage from '@/pages/ClubProfilePage'
import CompetitionDirectoryPage from '@/pages/CompetitionDirectoryPage'
import CompetitionPage from '@/pages/CompetitionPage'
import DesignSystemPage from '@/pages/DesignSystemPage'
import FixturesPage from '@/pages/FixturesPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import HomePage from '@/pages/HomePage'
import LeagueAdminDashboardPage from '@/pages/LeagueAdminDashboardPage'
import LiveMatchDashboardPage from '@/pages/LiveMatchDashboardPage'
import LiveScoresPage from '@/pages/LiveScoresPage'
import LoginPage from '@/pages/LoginPage'
import MatchCentrePage from '@/pages/MatchCentrePage'
import NotFoundPage from '@/pages/NotFoundPage'
import PendingApprovalPage from '@/pages/PendingApprovalPage'
import PlayerDirectoryPage from '@/pages/PlayerDirectoryPage'
import PlayerProfilePage from '@/pages/PlayerProfilePage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import ResultsPage from '@/pages/ResultsPage'
import StandingsPage from '@/pages/StandingsPage'
import StatisticsPage from '@/pages/StatisticsPage'
import SuperAdminDashboardPage from '@/pages/SuperAdminDashboardPage'
import TopScorersPage from '@/pages/TopScorersPage'
import TransferCentrePage from '@/pages/TransferCentrePage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import SearchResultsPage from '@/pages/SearchResultsPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path={ROUTES.designSystem} element={<DesignSystemPage />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
          <Route path={ROUTES.accountInvitation} element={<AccountInvitationPage />} />
          <Route path={ROUTES.acceptInvitation} element={<AcceptInvitationPage />} />
          <Route path={ROUTES.accessDenied} element={<AccessDeniedPage />} />
          <Route path={ROUTES.pendingApproval} element={<PendingApprovalPage />} />
          <Route path={ROUTES.admin} element={<AuthGuard dashboard="admin"><SuperAdminDashboardPage /></AuthGuard>} />
          <Route path={ROUTES.leagueAdmin} element={<AuthGuard dashboard="league"><LeagueAdminDashboardPage /></AuthGuard>} />
          <Route path={ROUTES.clubDashboard} element={<AuthGuard dashboard="club"><ClubDashboardPage /></AuthGuard>} />
          <Route path={ROUTES.liveMatch} element={<AuthGuard dashboard="liveMatch"><LiveMatchDashboardPage /></AuthGuard>} />
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.liveScores} element={<LiveScoresPage />} />
            <Route path={ROUTES.fixtures} element={<FixturesPage />} />
            <Route path={ROUTES.results} element={<ResultsPage />} />
            <Route path={ROUTES.standings} element={<StandingsPage />} />
            <Route path={ROUTES.topScorers} element={<TopScorersPage />} />
            <Route path={ROUTES.playerStatistics} element={<StatisticsPage />} />
            <Route path={ROUTES.teamStatistics} element={<StatisticsPage />} />
            <Route path={ROUTES.statistics} element={<StatisticsPage />} />
            <Route path={ROUTES.transfers} element={<TransferCentrePage />} />
            <Route path={ROUTES.competitions} element={<CompetitionDirectoryPage />} />
            <Route path={`${ROUTES.competitions}/:competitionId`} element={<CompetitionPage />} />
            <Route path={ROUTES.clubs} element={<ClubDirectoryPage />} />
            <Route path={`${ROUTES.clubs}/:clubId`} element={<ClubProfilePage />} />
            <Route path={ROUTES.players} element={<PlayerDirectoryPage />} />
            <Route path={ROUTES.player} element={<PlayerProfilePage />} />
            <Route path={`${ROUTES.matches}/:matchId`} element={<MatchCentrePage />} />
            {PLACEHOLDER_PAGES.map((page) => (
              <Route key={page.path} path={page.path} element={<PlaceholderPage {...page} />} />
            ))}
            <Route path={ROUTES.search} element={<SearchResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
