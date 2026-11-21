import { Building2, CheckCircle2, FileClock, ShieldCheck } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { ADMIN_CLUB_VERIFICATIONS, type AdminClubVerification } from '@/config/admin'
import type { AdminSectionProps } from './types'

export function ClubManagementSection({ search, onAction }: AdminSectionProps) {
  const rows = ADMIN_CLUB_VERIFICATIONS.filter(
    (club) =>
      !search ||
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.district.toLowerCase().includes(search.toLowerCase()) ||
      club.competition.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<AdminClubVerification>[] = [
    { key: 'club', header: 'Club', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.id}</span></p> },
    { key: 'district', header: 'District', cell: (row) => <span className="text-xs text-ink-muted">{row.district}</span> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'documents', header: 'Documents', cell: (row) => <span className="text-xs font-semibold text-ink">{row.documents}</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Verification', cell: (row) => <AdminStatusPill status={row.verification} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="size-3.5" aria-hidden />} onClick={() => onAction(`Verifying ${row.name} is a frontend preview.`)}>Verify</Button>
          <Button variant="ghost" size="sm" onClick={() => onAction(`A review note for ${row.name} is a frontend preview.`)}>Request info</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Clubs in directory" value={ADMIN_CLUB_VERIFICATIONS.length} icon={<Building2 className="size-5" aria-hidden />} />
        <StatisticCard label="Verified" value={ADMIN_CLUB_VERIFICATIONS.filter((club) => club.verification === 'Verified').length} icon={<ShieldCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Awaiting review" value={ADMIN_CLUB_VERIFICATIONS.filter((club) => club.verification === 'Pending').length} icon={<FileClock className="size-5" aria-hidden />} />
        <StatisticCard label="Rejected" value={ADMIN_CLUB_VERIFICATIONS.filter((club) => club.verification === 'Rejected').length} icon={<Building2 className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Club verification"
        description="Review submissions, documents and publication status for each club."
        bodyClassName="p-0"
      >
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club verification records" compact />
      </AdminPanel>
    </>
  )
}
