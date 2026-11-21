import { Info } from 'lucide-react'

export function AuthNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs text-orange-900">
      <Info className="mt-0.5 size-3.5 shrink-0 text-orange-600" aria-hidden />
      <p>
        <span className="font-semibold">Frontend preview only.</span> No authentication service is connected and no
        account data is submitted or stored.
      </p>
    </div>
  )
}
