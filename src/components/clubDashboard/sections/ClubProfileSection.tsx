import { useState } from 'react'
import { Building2, LockKeyhole, Save, ShieldCheck } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, ClubBadge, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_PERMISSIONS, CLUB_PROFILE, CLUB_REPRESENTATIVES, CLUB_SCOPE_OPTIONS, type ClubRepresentative } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

export function ClubProfileSection({ search, onAction }: ClubSectionProps) {
  const [name, setName] = useState(CLUB_PROFILE.name)
  const [district, setDistrict] = useState(CLUB_PROFILE.district)
  const [stadium, setStadium] = useState(CLUB_PROFILE.stadium)
  const [coach, setCoach] = useState(CLUB_PROFILE.coach)
  const [contact, setContact] = useState('mpho@matlamafc.co.ls')
  const [phone, setPhone] = useState('+266 5880 1122')
  const [club, setClub] = useState<string>(CLUB_SCOPE_OPTIONS[0]?.value ?? '')

  const representatives = CLUB_REPRESENTATIVES.filter(
    (representative) => !search || representative.name.toLowerCase().includes(search.toLowerCase()) || representative.role.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<ClubRepresentative>[] = [
    { key: 'name', header: 'Representative', cell: (row) => <p className="font-semibold text-ink">{row.name}</p> },
    { key: 'role', header: 'Role', cell: (row) => <span className="text-xs text-ink-muted">{row.role}</span> },
    { key: 'relationship', header: 'Relationship', cell: (row) => <span className="text-xs text-ink-muted">{row.relationship}</span> },
    { key: 'email', header: 'Email', cell: (row) => <span className="text-xs text-ink-muted">{row.email}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Representative management is a frontend preview.')}>Manage</Button> },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Club identity" description="Only your authorised club can be edited here." className="xl:col-span-2">
          <div className="mb-5 flex items-center gap-4 rounded-xl border border-line bg-surface-muted p-4">
            <ClubBadge name={CLUB_PROFILE.name} shortName={CLUB_PROFILE.shortName} color={CLUB_PROFILE.color} size="lg" />
            <div className="min-w-0">
              <p className="font-display text-xl font-bold text-ink">{CLUB_PROFILE.name}</p>
              <p className="caption mt-1">{CLUB_PROFILE.competition} · {CLUB_PROFILE.district}</p>
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onAction('Club profile changes are a frontend preview; nothing was saved.')
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Authorised club</p>
              <Select options={CLUB_SCOPE_OPTIONS} value={club} onChange={setClub} ariaLabel="Select authorised club" />
            </div>
            <FormField label="Club name" name="club-name" value={name} onChange={(event) => setName(event.target.value)} required />
            <FormField label="District" name="club-district" value={district} onChange={(event) => setDistrict(event.target.value)} required />
            <FormField label="Stadium" name="club-stadium" value={stadium} onChange={(event) => setStadium(event.target.value)} required />
            <FormField label="Head coach" name="club-coach" value={coach} onChange={(event) => setCoach(event.target.value)} required />
            <FormField label="Contact email" name="club-email" type="email" value={contact} onChange={(event) => setContact(event.target.value)} required />
            <FormField label="Contact phone" name="club-phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<Save className="size-4" aria-hidden />}>Save profile preview</Button>
            </div>
          </form>
        </AdminPanel>

        <div className="space-y-5">
          <AdminPanel title="Representation scope" description="Access is bound to authorised clubs.">
            <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
                <div>
                  <p className="text-xs font-bold text-live">Authorised: {CLUB_PROFILE.name}</p>
                  <p className="caption mt-1">All forms and records in this workspace are limited to this club.</p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-line bg-surface-muted px-3 py-3">
              <div className="flex items-start gap-2">
                <LockKeyhole className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden />
                <p className="text-xs leading-relaxed text-ink-muted">Unauthorised clubs cannot be selected, viewed or managed from this workspace.</p>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Permission summary" description="Capabilities available to club roles.">
            <div className="space-y-2">
              {CLUB_PERMISSIONS.map((permission) => (
                <div key={permission.id} className="flex items-start justify-between gap-3 rounded-lg border border-line px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink">{permission.label}</p>
                    <p className="caption mt-0.5">{permission.roles.join(', ')}</p>
                  </div>
                  <Building2 className="size-3.5 shrink-0 text-primary" aria-hidden />
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel title="Authorised representatives" description="People permitted to act for your club." bodyClassName="p-0">
        <Table columns={columns} rows={representatives} rowKey={(row) => row.id} caption="Authorised club representatives" />
      </AdminPanel>
    </>
  )
}
