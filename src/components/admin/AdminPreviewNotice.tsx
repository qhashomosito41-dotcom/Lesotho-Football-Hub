import { Info } from 'lucide-react'

export function AdminPreviewNotice() {
  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-xl border border-orange-200 bg-accent-soft px-4 py-3 text-xs leading-relaxed text-accent-ink"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <span className="font-bold">Frontend design preview.</span> Records and actions on this screen are illustrative;
        nothing is saved and no administrative service is connected.
      </p>
    </div>
  )
}
