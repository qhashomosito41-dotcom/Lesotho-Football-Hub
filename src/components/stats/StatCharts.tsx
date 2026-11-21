import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS, type ChartDatum } from '@/config/statistics'

interface ChartProps {
  data: ChartDatum[]
  height?: number
}

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.live, CHART_COLORS.accent]

export function RankingBarChart({ data, height = 280 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={112}
            tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: 'var(--color-surface-muted)' }} />
          <Bar dataKey="value" name="Value" fill={CHART_COLORS.primary} radius={[0, 5, 5, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GoalsBarChart({ data, height = 260 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'var(--color-surface-muted)' }} />
          <Bar dataKey="value" name="Goals" fill={CHART_COLORS.live} radius={[5, 5, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GoalsLineChart({ data, height = 260 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-line)" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ stroke: 'var(--color-primary)' }} />
          <Line
            type="monotone"
            dataKey="value"
            name="Goals"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            dot={{ r: 3, fill: CHART_COLORS.primary }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function OutcomePieChart({ data, height = 260 }: ChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={86}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((entry, index) => (
          <span key={entry.name} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
              aria-hidden
            />
            {entry.name}: {entry.value}
          </span>
        ))}
      </div>
    </div>
  )
}
