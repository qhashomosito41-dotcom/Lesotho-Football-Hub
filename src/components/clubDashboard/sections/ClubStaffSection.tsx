import { useState, type FormEvent } from 'react'
import { LockKeyhole, Plus, Save, ShieldCheck } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_PERMISSIONS, CLUB_PROFILE, CLUB_STAFF, type ClubStaffMember } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

const staffRoles = ['Club administrator', 'Coach', 'Team manager', 'Kit manager']

export function ClubStaffSection({ search, onAction }: ClubSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(staffRoles[0])
  const [access, setAccess] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(CLUB_PERMISSIONS.map((permission) => [permission.id, [...permission.roles]])),
  )

  const rows = CLUB_STAFF.filter(
    (member) => !search || member.name.toLowerCase().includes(search.toLowerCase()) || member.role.toLowerCase().includes(search.toLowerCase()) || member.access.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Staff invitation is a frontend preview; no access was granted.')
    setName('')
    setEmail('')
  }

  const toggleRole = (moduleId: string, roleName: string) => {
    setAccess((current) => {
      const currentRoles = current[moduleId] ?? []
      return {
        ...current,
        [moduleId]: currentRoles.includes(roleName) ? currentRoles.filter((item) => item !== roleName) : [...currentRoles, roleName],
      }
    })
  }

  const columns: TableColumn<ClubStaffMember>[] = [
    { key: 'name', header: 'Staff member', cell: (row) => <p className="font-semibold text-ink">{row.name}</p> },
    { key: 'role', header: 'Role', cell: (row) => <span className="text-xs text-ink-muted">{row.role}</span> },
    { key: 'email', header: 'Email', cell: (row) => <span className="text-xs text-ink-muted">{row.email}</span> },
    { key: 'phone', header: 'Phone', cell: (row) => <span className="text-xs text-ink-muted">{row.phone}</span> },
    { key: 'access', header: 'Access', cell: (row) => <span className="text-xs text-ink-muted">{row.access}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Staff access management is a frontend preview.')}>Manage</Button> },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Add staff member" description={`Invite an authorised representative for ${CLUB_PROFILE.name}.`} className="xl:col-span-2">
          <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
            <FormField label="Full name" name="staff-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required />
            <FormField label="Email address" name="staff-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@club.co.ls" required />
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Role</p>
              <Select options={staffRoles.map((item) => ({ value: item, label: item }))} value={role} onChange={setRole} ariaLabel="Staff role" />
            </div>
            <FormField label="Phone number" name="staff-phone" placeholder="+266 …" />
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<Plus className="size-4" aria-hidden />}>Preview invitation</Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel title="Security boundary" description="Club-based permissions are enforced in the interface.">
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
                <div>
                  <p className="text-xs font-bold text-live">Authorised club</p>
                  <p className="caption mt-1">{CLUB_PROFILE.name}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
              <div className="flex items-start gap-2">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden />
                <p className="text-xs leading-relaxed text-ink-muted">Staff can manage only {CLUB_PROFILE.name}. Other clubs are outside this workspace.</p>
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Club staff" description="People with access to your club workspace." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club staff members" />
      </AdminPanel>

      <AdminPanel
        title="Club-based permissions"
        description="Representatives only receive modules allowed for their role."
        actions={
          <Button variant="outline" size="sm" iconLeft={<Save className="size-3.5" aria-hidden />} onClick={() => onAction('Permission changes are a frontend preview; nothing was saved.')}>
            Save permissions
          </Button>
        }
      >
        <div className="space-y-4">
          {CLUB_PERMISSIONS.map((permission) => (
            <div key={permission.id} className="rounded-lg border border-line bg-surface-muted p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{permission.label}</p>
                  <p className="caption mt-1">{permission.description}</p>
                </div>
                <span className="text-[10px] font-bold tracking-wide text-primary uppercase">{CLUB_PROFILE.name}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {staffRoles.map((roleName) => (
                  <label key={`${permission.id}-${roleName}`} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
                    <input
                      type="checkbox"
                      checked={(access[permission.id] ?? []).includes(roleName)}
                      onChange={() => toggleRole(permission.id, roleName)}
                      aria-label={`${permission.label} access for ${roleName}`}
                      className="size-3.5 rounded border-line-strong text-primary"
                    />
                    <span className="text-[11px] font-semibold text-ink-muted">{roleName}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>
    </>
  )
}
