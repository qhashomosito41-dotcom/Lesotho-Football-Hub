import { useState, type FormEvent } from 'react'
import { Check, Plus, ShieldCheck, UserCheck, UserX, Users } from 'lucide-react'
import { FormField } from '@/components/auth'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Modal, Select, StatisticCard, Table, Tabs, type TableColumn } from '@/components/ui'
import {
  ADMIN_APPOINTMENTS,
  ADMIN_PERMISSION_MODULES,
  ADMIN_REQUESTS,
  ADMIN_STATS,
  ADMIN_USERS,
  type AdminAccessRequest,
  type AdminAppointment,
  type AdminUser,
} from '@/config/admin'
import { getRole, ROLE_OPTIONS, USER_ROLES, type UserRoleId } from '@/config/auth'
import type { AdminSectionProps } from './types'

type UserTab = 'accounts' | 'requests' | 'permissions' | 'appointments'

const USER_TABS = [
  { id: 'accounts' as const, label: 'Accounts' },
  { id: 'requests' as const, label: 'Account requests' },
  { id: 'permissions' as const, label: 'Permissions' },
  { id: 'appointments' as const, label: 'Appointments' },
]

const ROLE_FILTER_OPTIONS = [{ value: 'all', label: 'All roles' }, ...ROLE_OPTIONS]
const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Suspended', label: 'Suspended' },
]

function matches(value: string, search: string) {
  return value.toLowerCase().includes(search.trim().toLowerCase())
}

export function UserManagementSection({ search, onAction }: AdminSectionProps) {
  const [tab, setTab] = useState<UserTab>('accounts')
  const [roleFilter, setRoleFilter] = useState<UserRoleId | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | AdminUser['status']>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null)
  const [roleDraft, setRoleDraft] = useState<UserRoleId>('public-supporter')
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const role of USER_ROLES) {
      for (const module of ADMIN_PERMISSION_MODULES) {
        initial[`${role.id}:${module.id}`] = role.id === 'super-administrator' || role.id === 'league-administrator'
      }
    }
    return initial
  })

  const filteredUsers = ADMIN_USERS.filter((user) => {
    const role = getRole(user.role)
    const searchMatch =
      !search ||
      matches(user.name, search) ||
      matches(user.email, search) ||
      matches(user.organization, search) ||
      matches(role?.label ?? '', search)
    return searchMatch && (roleFilter === 'all' || user.role === roleFilter) && (statusFilter === 'all' || user.status === statusFilter)
  })

  const filteredRequests = ADMIN_REQUESTS.filter(
    (request) =>
      !search ||
      matches(request.name, search) ||
      matches(request.email, search) ||
      matches(request.organization, search),
  )

  const filteredAppointments = ADMIN_APPOINTMENTS.filter(
    (appointment) =>
      !search || matches(appointment.name, search) || matches(appointment.email, search) || matches(appointment.scope, search),
  )

  const userColumns: TableColumn<AdminUser>[] = [
    {
      key: 'user',
      header: 'User',
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="caption truncate">{row.email}</p>
          <p className="caption truncate">{row.id}</p>
        </div>
      ),
    },
    { key: 'role', header: 'Role', cell: (row) => <span className="text-xs text-ink-muted">{getRole(row.role)?.label ?? row.role}</span> },
    { key: 'organization', header: 'Organization', cell: (row) => <span className="text-xs text-ink-muted">{row.organization}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'last', header: 'Last active', cell: (row) => <span className="text-xs text-ink-muted">{row.lastActive}</span> },
    { key: 'mfa', header: 'MFA', cell: (row) => <span className="text-xs font-semibold text-ink">{row.mfa ? 'Enabled' : 'Off'}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(`Viewing ${row.name} is a frontend preview.`)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRoleTarget(row)
              setRoleDraft(row.role)
            }}
          >
            Role
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(`Suspending ${row.name} is a frontend preview; no account was changed.`)}
          >
            Suspend
          </Button>
        </div>
      ),
    },
  ]

  const requestColumns: TableColumn<AdminAccessRequest>[] = [
    { key: 'name', header: 'Applicant', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.email}</span></p> },
    { key: 'role', header: 'Requested role', cell: (row) => <span className="text-xs text-ink-muted">{getRole(row.requestedRole)?.label}</span> },
    { key: 'organization', header: 'Organization', cell: (row) => <span className="text-xs text-ink-muted">{row.organization}</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="primary" size="sm" iconLeft={<Check className="size-3.5" aria-hidden />} onClick={() => onAction(`Approving ${row.name} is a frontend preview.`)}>Approve</Button>
          <Button variant="ghost" size="sm" onClick={() => onAction(`Rejecting ${row.name} is a frontend preview.`)}>Reject</Button>
        </div>
      ),
    },
  ]

  const appointmentColumns: TableColumn<AdminAppointment>[] = [
    { key: 'name', header: 'Nominee', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.email}</span></p> },
    { key: 'role', header: 'Role', cell: (row) => <span className="text-xs text-ink-muted">{getRole(row.role)?.label}</span> },
    { key: 'scope', header: 'Scope', cell: (row) => <span className="text-xs text-ink-muted">{row.scope}</span> },
    { key: 'nominator', header: 'Nominated by', cell: (row) => <span className="text-xs text-ink-muted">{row.nominatedBy}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <Button
          variant={row.status === 'Pending' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onAction(`Appointment action for ${row.name} is a frontend preview.`)}
        >
          {row.status === 'Pending' ? 'Appoint' : 'Review'}
        </Button>
      ),
    },
  ]

  const handleCreate = () => {
    setCreateOpen(false)
    onAction('Account creation is a frontend preview; no account was created.')
  }

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleCreate()
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Total users" value={ADMIN_STATS.users} icon={<Users className="size-5" aria-hidden />} />
        <StatisticCard label="Pending accounts" value={ADMIN_STATS.pendingApprovals} icon={<UserCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Suspended" value={ADMIN_STATS.suspendedAccounts} icon={<UserX className="size-5" aria-hidden />} />
        <StatisticCard label="Permission modules" value={ADMIN_PERMISSION_MODULES.length} icon={<ShieldCheck className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Accounts and access"
        description="View users, review requests and manage role-based permissions."
        actions={<Button size="sm" iconLeft={<Plus className="size-4" aria-hidden />} onClick={() => setCreateOpen(true)}>Create account</Button>}
        bodyClassName="p-0 sm:p-0"
      >
        <div className="border-b border-line px-5 pt-4">
          <Tabs
            items={USER_TABS}
            value={tab}
            onChange={(value) => setTab(value as UserTab)}
            ariaLabel="User management sections"
          />
        </div>

        {tab === 'accounts' && (
          <div className="p-5">
            <div className="mb-4 flex flex-wrap gap-3">
              <Select options={ROLE_FILTER_OPTIONS} value={roleFilter} onChange={(value) => setRoleFilter(value as UserRoleId | 'all')} ariaLabel="Filter users by role" className="w-48" />
              <Select options={STATUS_FILTER_OPTIONS} value={statusFilter} onChange={(value) => setStatusFilter(value as 'all' | AdminUser['status'])} ariaLabel="Filter users by status" className="w-44" />
              <p className="caption self-center">{filteredUsers.length} of {ADMIN_USERS.length} accounts shown</p>
            </div>
            <Table columns={userColumns} rows={filteredUsers} rowKey={(row) => row.id} caption="Platform users" compact />
          </div>
        )}

        {tab === 'requests' && (
          <div className="p-5">
            <Table columns={requestColumns} rows={filteredRequests} rowKey={(row) => row.id} caption="Account requests" compact />
          </div>
        )}

        {tab === 'permissions' && (
          <div className="p-5">
            <p className="body-muted mb-4">
              Toggle permission previews by role. Changes are local to this screen and are not persisted.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="data-table data-table--compact">
                <thead>
                  <tr>
                    <th scope="col">Module</th>
                    {USER_ROLES.map((role) => (
                      <th key={role.id} scope="col" className="text-center">{role.shortLabel}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_PERMISSION_MODULES.map((module) => (
                    <tr key={module.id}>
                      <td>
                        <p className="font-semibold text-ink">{module.label}</p>
                        <p className="caption">{module.description}</p>
                      </td>
                      {USER_ROLES.map((role) => {
                        const key = `${role.id}:${module.id}`
                        return (
                          <td key={key} className="text-center">
                            <input
                              type="checkbox"
                              aria-label={`${module.label} permission for ${role.label}`}
                              checked={permissions[key] ?? false}
                              onChange={() => setPermissions((current) => ({ ...current, [key]: !current[key] }))}
                              className="size-4 rounded border-line-strong text-primary"
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button className="mt-4" variant="outline" size="sm" onClick={() => onAction('Permission changes are a frontend preview; nothing was saved.')}>
              Save permission preview
            </Button>
          </div>
        )}

        {tab === 'appointments' && (
          <div className="p-5">
            <Table columns={appointmentColumns} rows={filteredAppointments} rowKey={(row) => row.id} caption="Administrator appointments" compact />
          </div>
        )}
      </AdminPanel>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create account"
        description="Preview the account creation form for an LFH administrator."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Preview account</Button>
          </>
        }
      >
        <form id="create-account-form" onSubmit={handleCreateSubmit} className="space-y-4">
          <FormField label="Full name" name="new-user-name" placeholder="Full name" required />
          <FormField label="Email address" type="email" name="new-user-email" placeholder="name@example.com" required />
          <FormField label="Organization" name="new-user-org" placeholder="Club, competition or department" required />
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Role</p>
            <Select options={ROLE_OPTIONS} value="public-supporter" onChange={() => undefined} ariaLabel="New account role" />
          </div>
          <p className="caption">Submitting only shows a preview notice; no account is created.</p>
        </form>
      </Modal>

      <Modal
        open={Boolean(roleTarget)}
        onClose={() => setRoleTarget(null)}
        title="Assign role"
        description={roleTarget ? `Choose a role for ${roleTarget.name}.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRoleTarget(null)}>Cancel</Button>
            <Button
              onClick={() => {
                onAction(`Role assignment for ${roleTarget?.name ?? 'the user'} is a frontend preview.`)
                setRoleTarget(null)
              }}
            >
              Preview assignment
            </Button>
          </>
        }
      >
        <p className="body-muted mb-4">Current role: {roleTarget ? getRole(roleTarget.role)?.label : '—'}</p>
        <Select options={ROLE_OPTIONS} value={roleDraft} onChange={(value) => setRoleDraft(value as UserRoleId)} ariaLabel="Assign account role" />
      </Modal>
    </>
  )
}
