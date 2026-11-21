import { Info } from 'lucide-react'

export function DemoNotice() {
  return (
    <div className="border-b border-accent/20 bg-accent/10">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center sm:px-6">
        <Info className="size-3.5 shrink-0 text-orange-300" aria-hidden />
        <p className="text-xs text-orange-200">
          <span className="font-semibold text-orange-100">Demonstration data.</span> Scores, tables and
          statistics on this page are sample content for design preview only.
        </p>
      </div>
    </div>
  )
}
