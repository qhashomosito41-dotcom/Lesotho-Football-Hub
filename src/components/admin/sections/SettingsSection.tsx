import { useState } from 'react'
import { Save, Settings2, SlidersHorizontal } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, StatisticCard } from '@/components/ui'
import { ADMIN_SETTING_GROUPS } from '@/config/admin'
import type { AdminSectionProps } from './types'

export function SettingsSection({ search, onAction }: AdminSectionProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(ADMIN_SETTING_GROUPS.flatMap((group) => group.settings.map((setting) => [setting.id, setting.value]))),
  )

  const groups = ADMIN_SETTING_GROUPS.map((group) => ({
    ...group,
    settings: group.settings.filter(
      (setting) => !search || setting.label.toLowerCase().includes(search.toLowerCase()) || setting.description.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((group) => group.settings.length > 0)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Setting groups" value={ADMIN_SETTING_GROUPS.length} icon={<Settings2 className="size-5" aria-hidden />} />
        <StatisticCard label="Configurable options" value={ADMIN_SETTING_GROUPS.reduce((total, group) => total + group.settings.length, 0)} icon={<SlidersHorizontal className="size-5" aria-hidden />} />
        <StatisticCard label="Toggles" value={ADMIN_SETTING_GROUPS.flatMap((group) => group.settings).filter((setting) => setting.type === 'toggle').length} icon={<SlidersHorizontal className="size-5" aria-hidden />} />
        <StatisticCard label="Environment" value="Preview" icon={<Settings2 className="size-5" aria-hidden />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {groups.map((group) => (
          <AdminPanel
            key={group.id}
            title={group.title}
            description={group.description}
            actions={
              <Button variant="outline" size="sm" iconLeft={<Save className="size-3.5" aria-hidden />} onClick={() => onAction(`Saving ${group.title} is a frontend preview; nothing was changed.`)}>
                Save group
              </Button>
            }
          >
            <div className="space-y-5">
              {group.settings.map((setting) => (
                <div key={setting.id} className="rounded-lg border border-line bg-surface-muted p-4">
                  {setting.type === 'toggle' ? (
                    <label className="flex cursor-pointer items-start justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{setting.label}</span>
                        <span className="caption mt-1 block">{setting.description}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(values[setting.id])}
                        onChange={(event) => setValues((current) => ({ ...current, [setting.id]: event.target.checked }))}
                        aria-label={setting.label}
                        className="mt-0.5 size-4 shrink-0 rounded border-line-strong text-primary"
                      />
                    </label>
                  ) : setting.type === 'select' ? (
                    <div>
                      <p className="text-sm font-semibold text-ink">{setting.label}</p>
                      <p className="caption mt-1">{setting.description}</p>
                      <div className="mt-3">
                        <Select
                          options={(setting.options ?? []).map((option) => ({ value: option, label: option }))}
                          value={String(values[setting.id] ?? '')}
                          onChange={(value) => setValues((current) => ({ ...current, [setting.id]: value }))}
                          ariaLabel={setting.label}
                        />
                      </div>
                    </div>
                  ) : (
                    <FormField
                      label={setting.label}
                      name={setting.id}
                      hint={setting.description}
                      value={String(values[setting.id] ?? '')}
                      onChange={(event) => setValues((current) => ({ ...current, [setting.id]: event.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </AdminPanel>
        ))}
      </div>
    </>
  )
}
