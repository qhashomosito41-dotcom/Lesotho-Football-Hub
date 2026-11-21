import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { ROUTES } from '@/config/app'
import type { UserRoleId } from '@/config/auth'
import { toDatabaseRole, toUiRole } from '@/lib/authRoles'
import type { Database } from '@/lib/database.types'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export type UserProfile = Database['public']['Tables']['users']['Row']
export type RoleAssignment = Database['public']['Tables']['user_roles']['Row']
export type ApprovalStatus = Database['public']['Enums']['approval_status']
export type DashboardKey = 'admin' | 'league' | 'club' | 'liveMatch'

export interface AuthResult {
  success: boolean
  message?: string
  token?: string
}

export interface InvitationInput {
  fullName: string
  email: string
  role: UserRoleId
  clubId?: string | null
  competitionId?: string | null
  message?: string | null
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  roles: RoleAssignment[]
  authorisedClubIds: string[]
  assignedCompetitionIds: string[]
  loading: boolean
  configured: boolean
  isPreviewMode: boolean
  isApproved: boolean
  primaryRole: UserRoleId
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (fullName: string, email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  acceptInvitation: (token: string) => Promise<AuthResult>
  createInvitation: (input: InvitationInput) => Promise<AuthResult>
  assignRole: (
    userId: string,
    role: UserRoleId,
    clubId?: string | null,
    competitionId?: string | null,
  ) => Promise<AuthResult>
  setUserApproval: (userId: string, status: ApprovalStatus) => Promise<AuthResult>
  refresh: () => Promise<void>
  hasRole: (role: UserRoleId) => boolean
  canManageClub: (clubId: string) => boolean
  canManageCompetition: (competitionId: string) => boolean
  canAccessDashboard: (key: DashboardKey) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const ROLE_PRIORITY: UserRoleId[] = [
  'super-administrator',
  'league-administrator',
  'club-administrator',
  'match-official',
  'coach',
  'assistant-coach',
  'team-manager',
  'public-supporter',
]

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Unable to complete the request.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<RoleAssignment[]>([])
  const [authorisedClubIds, setAuthorisedClubIds] = useState<string[]>([])
  const [assignedCompetitionIds, setAssignedCompetitionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadProfile = useCallback(async (authUser: User | null) => {
    if (!isSupabaseConfigured || !authUser) {
      setProfile(null)
      setRoles([])
      setAuthorisedClubIds([])
      setAssignedCompetitionIds([])
      setLoading(false)
      return
    }

    const [profileResult, rolesResult, staffResult] = await Promise.all([
      supabase.from('users').select('*').eq('id', authUser.id).maybeSingle(),
      supabase.from('user_roles').select('*').eq('user_id', authUser.id).eq('is_active', true),
      supabase.from('club_staff').select('club_id').eq('user_id', authUser.id).eq('status', 'active'),
    ])

    const activeRoles = rolesResult.data ?? []
    const clubIds = new Set<string>()
    const competitionIds = new Set<string>()

    activeRoles.forEach((assignment) => {
      if (assignment.club_id) clubIds.add(assignment.club_id)
      if (assignment.competition_id) competitionIds.add(assignment.competition_id)
    })
    staffResult.data?.forEach((membership) => {
      if (membership.club_id) clubIds.add(membership.club_id)
    })

    setProfile(profileResult.data ?? null)
    setRoles(activeRoles)
    setAuthorisedClubIds([...clubIds])
    setAssignedCompetitionIds([...competitionIds])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      void loadProfile(data.session?.user ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      void loadProfile(nextSession?.user ?? null)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [loadProfile])

  const refresh = useCallback(async () => {
    await loadProfile(session?.user ?? null)
  }, [loadProfile, session])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Preview mode: Supabase is not configured.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }

    await loadProfile(data.user)
    return { success: true, message: 'Signed in successfully.' }
  }, [loadProfile])

  const signUp = useCallback(
    async (fullName: string, email: string, password: string): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { success: true, message: 'Preview mode: no account was created.' }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) return { success: false, message: error.message }

      if (data.session) await loadProfile(data.session.user)
      return {
        success: true,
        message: data.session
          ? 'Account created.'
          : 'Account created. Confirm your email before signing in.',
      }
    },
    [loadProfile],
  )

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Preview mode: no session to end.' }
    }

    const { error } = await supabase.auth.signOut()
    if (error) return { success: false, message: error.message }

    setSession(null)
    setProfile(null)
    setRoles([])
    setAuthorisedClubIds([])
    setAssignedCompetitionIds([])
    return { success: true, message: 'Signed out successfully.' }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Preview mode: no reset email was sent.' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${ROUTES.resetPassword}`,
    })
    if (error) return { success: false, message: error.message }

    return { success: true, message: 'Password reset instructions have been sent.' }
  }, [])

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return { success: true, message: 'Preview mode: no password was changed.' }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { success: false, message: error.message }

    return { success: true, message: 'Password updated successfully.' }
  }, [])

  const acceptInvitation = useCallback(
    async (token: string): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { success: true, message: 'Preview mode: invitation was not accepted.' }
      }

      const { error } = await supabase.rpc('accept_invitation', { p_token: token })
      if (error) return { success: false, message: error.message }

      await refresh()
      return { success: true, message: 'Invitation accepted. Administrator approval is still required.' }
    },
    [refresh],
  )

  const createInvitation = useCallback(
    async (input: InvitationInput): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { success: true, token: 'PREVIEW-INVITATION' }
      }

      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          email: input.email.trim().toLowerCase(),
          full_name: input.fullName.trim(),
          role: toDatabaseRole(input.role),
          club_id: input.clubId || null,
          competition_id: input.competitionId || null,
          message: input.message || null,
        })
        .select('token')
        .single()

      if (error) return { success: false, message: error.message }
      return { success: true, token: data.token, message: 'Invitation created.' }
    },
    [],
  )

  const assignRole = useCallback(
    async (
      userId: string,
      role: UserRoleId,
      clubId?: string | null,
      competitionId?: string | null,
    ): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { success: true, message: 'Preview mode: role was not assigned.' }
      }

      const { error } = await supabase.rpc('assign_role', {
        p_user_id: userId,
        p_role: toDatabaseRole(role),
        p_club_id: clubId || null,
        p_competition_id: competitionId || null,
      })
      if (error) return { success: false, message: error.message }

      await refresh()
      return { success: true, message: 'Role assigned successfully.' }
    },
    [refresh],
  )

  const setUserApproval = useCallback(
    async (userId: string, status: ApprovalStatus): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return { success: true, message: 'Preview mode: approval status was not changed.' }
      }

      const { error } = await supabase.rpc('set_user_approval', {
        p_user_id: userId,
        p_status: status,
      })
      if (error) return { success: false, message: error.message }

      await refresh()
      return { success: true, message: 'Account status updated.' }
    },
    [refresh],
  )

  const primaryRole = useMemo<UserRoleId>(() => {
    if (!isSupabaseConfigured) return 'public-supporter'

    const assigned = roles
      .map((assignment) => toUiRole(assignment.role))
      .filter((role): role is UserRoleId => role !== null)

    return ROLE_PRIORITY.find((role) => assigned.includes(role)) ?? 'public-supporter'
  }, [roles])

  const hasRole = useCallback(
    (role: UserRoleId) => {
      if (!isSupabaseConfigured) return true
      return roles.some((assignment) => toUiRole(assignment.role) === role)
    },
    [roles],
  )

  const isApproved = !isSupabaseConfigured || profile?.approval_status === 'approved'

  const canManageClub = useCallback(
    (clubId: string) => {
      if (!isSupabaseConfigured) return true
      if (hasRole('super-administrator')) return true
      return authorisedClubIds.includes(clubId)
    },
    [authorisedClubIds, hasRole],
  )

  const canManageCompetition = useCallback(
    (competitionId: string) => {
      if (!isSupabaseConfigured) return true
      if (hasRole('super-administrator')) return true
      return assignedCompetitionIds.includes(competitionId)
    },
    [assignedCompetitionIds, hasRole],
  )

  const canAccessDashboard = useCallback(
    (key: DashboardKey) => {
      if (!isSupabaseConfigured) return true
      if (hasRole('super-administrator')) return true
      if (key === 'admin') return false
      if (key === 'league') return hasRole('league-administrator')
      if (key === 'club') {
        return hasRole('club-administrator') || hasRole('coach') || hasRole('assistant-coach') || hasRole('team-manager')
      }
      return (
        hasRole('match-official') ||
        hasRole('club-administrator') ||
        hasRole('coach') ||
        hasRole('assistant-coach') ||
        hasRole('team-manager')
      )
    },
    [hasRole],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      roles,
      authorisedClubIds,
      assignedCompetitionIds,
      loading,
      configured: isSupabaseConfigured,
      isPreviewMode: !isSupabaseConfigured,
      isApproved,
      primaryRole,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      acceptInvitation,
      createInvitation,
      assignRole,
      setUserApproval,
      refresh,
      hasRole,
      canManageClub,
      canManageCompetition,
      canAccessDashboard,
    }),
    [
      session,
      profile,
      roles,
      authorisedClubIds,
      assignedCompetitionIds,
      loading,
      isApproved,
      primaryRole,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      acceptInvitation,
      createInvitation,
      assignRole,
      setUserApproval,
      refresh,
      hasRole,
      canManageClub,
      canManageCompetition,
      canAccessDashboard,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { errorMessage as authErrorMessage }
