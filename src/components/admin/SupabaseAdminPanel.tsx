import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ShieldCheck, UserCheck, UserX } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { Button, Select, Spinner, StatisticCard, useToast, type SelectOption } from '@/components/ui'
import { ROLE_OPTIONS, type UserRoleId } from '@/config/auth'
import { toUiRole } from '@/lib/authRoles'
import { supabase } from '@/lib/supabase'
import { useAuth, type ApprovalStatus, type RoleAssignment, type UserProfile } from '@/auth'

interface ManagedUser {
  profile: UserProfile
  roles: RoleAssignment[]
}

const PRIORITY: UserRoleId[] = [
  'super-administrator',
  'league-administrator',
  'club-administrator',
  'match-official',
  'coach',
  'assistant-coach',
  'team-manager',
  'public-supporter',
]

function primaryRole(roles: RoleAssignment[]): UserRoleId {
  const assigned = roles.map((assignment) => toUiRole(assignment.role)).filter((role): role is UserRoleId => role !== null)
  return PRIORITY.find((role) => assigned.includes(role)) ?? 'public-supporter'
}

export function SupabaseAdminPanel() {
  const { assignRole, setUserApproval, refresh } = useAuth()
  const toast = useToast()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [clubs, setClubs] = useState<SelectOption[]>([])
  const [competitions, setCompetitions] = useState<SelectOption[]>([])
  const [roleDrafts, setRoleDrafts] = useState<Record<string, UserRoleId>>({})
  const [clubDrafts, setClubDrafts] = useState<Record<string, string>>({})
  const [competitionDrafts, setCompetitionDrafts] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [userResult, roleResult, clubResult, competitionResult] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('*'),
      supabase.from('clubs').select('id, name').order('name'),
      supabase.from('competitions').select('id, name').order('name'),
    ])

    const allRoles = roleResult.data ?? []
    setUsers(
      (userResult.data ?? []).map((profile) => ({
        profile,
        roles: allRoles.filter((assignment) => assignment.user_id === profile.id && assignment.is_active),
      })),
    )
    setClubs((clubResult.data ?? []).map((item) => ({ value: item.id, label: item.name })))
    setCompetitions((competitionResult.data ?? []).map((item) => ({ value: item.id, label: item.name })))
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const counts = useMemo(
    () => ({
      total: users.length,
      pending: users.filter((item) => item.profile.approval_status === 'pending').length,
      approved: users.filter((item) => item.profile.approval_status === 'approved').length,
    }),
    [users],
  )

  const approve = async (userId: string, status: ApprovalStatus) => {
    setBusyId(userId)
    const result = await setUserApproval(userId, status)
    setBusyId(null)
    toast[result.success ? 'success' : 'error'](result.success ? 'Account updated' : 'Update failed', result.message)
    if (result.success) {
      await load()
      await refresh()
    }
  }

  const assign = async (user: ManagedUser) => {
    const role = roleDrafts[user.profile.id] ?? primaryRole(user.roles)
    const needsClub = ['club-administrator', 'coach', 'assistant-coach', 'team-manager'].includes(role)
    const needsCompetition = ['league-administrator', 'match-official'].includes(role)

    setBusyId(user.profile.id)
    const result = await assignRole(
      user.profile.id,
      role,
      needsClub ? clubDrafts[user.profile.id] || null : null,
      needsCompetition ? competitionDrafts[user.profile.id] || null : null,
    )
    setBusyId(null)
    toast[result.success ? 'success' : 'error'](result.success ? 'Role assigned' : 'Assignment failed', result.message)
    if (result.success) await load()
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatisticCard label="Supabase users" value={counts.total} icon={<ShieldCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Pending approval" value={counts.pending} icon={<UserCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Approved" value={counts.approved} icon={<CheckCircle2 className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Live access control"
        description="Approve accounts and assign scoped roles backed by Supabase RLS policies."
      >
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" label="Loading accounts…" />
          </div>
        ) : (
          <div className="grid gap-3">
            {users.length === 0 && <p className="body-muted">No Supabase accounts have been created yet.</p>}
            {users.map((user) => {
              const role = roleDrafts[user.profile.id] ?? primaryRole(user.roles)
              const needsClub = ['club-administrator', 'coach', 'assistant-coach', 'team-manager'].includes(role)
              const needsCompetition = ['league-administrator', 'match-official'].includes(role)

              return (
                <div key={user.profile.id} className="rounded-xl border border-line bg-surface-muted p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{user.profile.full_name}</p>
                      <p className="caption truncate">{user.profile.email}</p>
                      <p className="caption mt-1 uppercase">Status: {user.profile.approval_status}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        loading={busyId === user.profile.id}
                        onClick={() => void approve(user.profile.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        loading={busyId === user.profile.id}
                        onClick={() => void approve(user.profile.id, 'suspended')}
                        iconLeft={<UserX className="size-3.5" aria-hidden />}
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Select
                      options={ROLE_OPTIONS}
                      value={role}
                      onChange={(value) => setRoleDrafts((current) => ({ ...current, [user.profile.id]: value as UserRoleId }))}
                      ariaLabel={`Role for ${user.profile.email}`}
                    />
                    {needsClub && (
                      <Select
                        options={clubs}
                        value={clubDrafts[user.profile.id] ?? ''}
                        onChange={(value) => setClubDrafts((current) => ({ ...current, [user.profile.id]: value }))}
                        placeholder="Select club"
                        ariaLabel={`Club scope for ${user.profile.email}`}
                      />
                    )}
                    {needsCompetition && (
                      <Select
                        options={competitions}
                        value={competitionDrafts[user.profile.id] ?? ''}
                        onChange={(value) => setCompetitionDrafts((current) => ({ ...current, [user.profile.id]: value }))}
                        placeholder="Select competition"
                        ariaLabel={`Competition scope for ${user.profile.email}`}
                      />
                    )}
                    <Button size="sm" onClick={() => void assign(user)} loading={busyId === user.profile.id}>
                      Assign role
                    </Button>
                  </div>

                  <p className="caption mt-3">
                    Active roles: {user.roles.length > 0 ? user.roles.map((assignment) => assignment.role).join(', ') : 'none'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </AdminPanel>
    </div>
  )
}
