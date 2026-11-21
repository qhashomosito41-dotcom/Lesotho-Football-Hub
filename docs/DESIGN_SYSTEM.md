# LFH Design System

Global tokens, typography rules, component inventory and styling conventions for Lesotho Football Hub.
Live reference: `/design-system`.

## Principles

1. **One system.** Every page is composed from tokens and components in `src/components/ui`. No one-off colours, fonts or shadows.
2. **Meaningful colour.** Colour communicates role, not decoration (green = live/positive, red = error/destructive, orange = highlight/notification, blue = action).
3. **Display vs interface type.** Barlow Condensed for football moments (titles, scores, team names, statistics). Inter for everything read as interface copy.
4. **Accessible by default.** All interactive elements inherit the global focus ring; status is never conveyed by colour alone (badges carry labels, live indicators pulse *and* say LIVE).

## Colour tokens

Defined in `src/styles/index.css` inside `@theme static`.

### Scales

| Family | Role |
| --- | --- |
| `navy-50…950` | Primary background, navigation, dark surfaces |
| `grey-50…900` | Neutral surfaces, borders, muted text |
| `blue-50…900` | Primary actions and interactive states |
| `green-50…900` | Live indicators and positive statistics |
| `orange-50…900` | Highlights, warnings, notifications, yellow cards |
| `red-50…900` | Errors, red cards, destructive actions |

### Semantic aliases (use these in components)

| Token | Utility examples | Value | Use |
| --- | --- | --- | --- |
| `canvas` | `bg-canvas` | `#070e1b` | Page background |
| `header` | `bg-header` | `#0b1526` | Navigation bars |
| `elevated` | `bg-elevated` | `#14213b` | Dark cards/panels |
| `surface` | `bg-surface` | `#ffffff` | Main content cards |
| `surface-muted` | `bg-surface-muted` | `#f8fafc` | Secondary surfaces |
| `surface-sunken` | `bg-surface-sunken` | `#f1f5f9` | Table headers, wells |
| `line` / `line-strong` | `border-line` | `#e2e8f0` / `#cbd5e1` | Borders |
| `ink` / `ink-muted` / `ink-subtle` | `text-ink` | `#070e1b` / `#64748b` / `#94a3b8` | Text hierarchy |
| `primary` (+`-hover`, `-active`, `-soft`) | `bg-primary` | `#2563eb` | Primary actions |
| `live` (+`-bright`, `-soft`) | `bg-live` | `#16a34a` | Live/positive |
| `accent` (+`-hover`, `-soft`, `-ink`) | `bg-accent` | `#f97316` | Highlights/notifications |
| `danger` (+`-hover`, `-soft`) | `bg-danger` | `#dc2626` | Errors/destructive |

Shadows: `shadow-card`, `shadow-raised`, `shadow-overlay`.
Motion: `animate-shimmer`, `animate-live-dot`, `animate-toast-in`, `animate-modal-in`, `animate-fade-in`; easing `--ease-spring`.

## Typography

Fonts loaded in `index.html`: **Barlow Condensed** (500/600/700), **Inter** (400/500/600/700).

| Role | Class | Rule |
| --- | --- | --- |
| Page title | `.page-title` | Display, clamp 1.875–2.5rem, 700 |
| Section heading | `.section-title` | Display, clamp 1.25–1.5rem, 600 |
| Card title | `.card-title` | Inter, 0.9375rem, 600 |
| Match score | `.score-display` | Display, tabular-nums, 700 |
| Team name | `.team-name` | Display, uppercase, 600, tracked |
| Player name | `.player-name` | Inter, 0.9375rem, 600 |
| Statistics | `.stat-value` | Display, tabular-nums, 700 |
| Navigation | `.nav-label` | Inter, 0.875rem, 500 |
| Supporting copy | `.body-muted` | Inter, 0.875rem, `ink-muted` |
| Metadata | `.caption` | Inter, 0.75rem, `ink-muted` |
| Field label | `.eyebrow` | Inter, 0.6875rem, uppercase, tracked, 600 |

To place display type on a dark surface, add `text-white` / `text-navy-200` — utilities override the component-layer colour.

## Component inventory

All exported from `@/components/ui`.

| Component | Key props | Notes |
| --- | --- | --- |
| `Button`, `ButtonLink` | `variant` (primary/secondary/outline/ghost/danger/success), `size`, `loading`, `iconLeft/Right` | `buttonClassName()` shares styles with non-Button triggers |
| `NavNavLink` | `tone` (dark/light), `end` | Router-aware active state |
| `Card` (+`Header/Title/Description/Body/Footer`) | `variant` (default/muted/dark), `padding` | Context propagates dividers |
| `MatchCard` | `status`, scores, `minute`, `competition`, `variant` (default/compact) | Live/upcoming/finished states |
| `ClubBadge` | `name`, `shortName`, `logoUrl`, `color`, `size` | Falls back to initials |
| `PlayerCard` | `number`, `position`, `club`, `stats` | Dark header, stats footer |
| `LeagueTable` | `rows`, `zoneMap`, `showForm` | Zone bars: success/primary/danger |
| `StatisticCard` | `value`, `unit`, `icon`, `trend` | KPI tile |
| `StatusBadge` | `kind` (match states, W/D/L, cards), `size` | Live pulses; carries text label |
| `Tabs` | `items`, `value/onChange`, `variant` (underline/pill), `tone` | Full keyboard support |
| `SearchField` | `value/onChange`, `loading` | Clear button built in |
| `Select` | `options`, `value/onChange` | Listbox semantics, keyboard, outside/ESC close |
| `Modal` | `open/onClose`, `title`, `footer` | Portal, ESC + overlay close, scroll lock |
| `Table` | `columns`, `rows`, `sort/onSortChange`, `loading`, `emptyState` | Generic grid on `.data-table` |
| `Pagination` | `page/pageCount/onPageChange`, `totalItems/pageSize` | Range built by `utils/pagination` |
| `ToastProvider`/`useToast` | `success/error/warning/info/dismiss` | Top-right stack, auto-dismiss |
| `EmptyState` | `title`, `description`, `action`, `tone` | Default state for empty lists |
| `Spinner`, `Skeleton` | `size`; `variant` block/text/circle | Shimmer animation |

Shared styles for grids: `.data-table` (plus `--dense`, `--compact` modifiers).

## Styling conventions

- Compose components with Tailwind utilities referencing semantic tokens; never raw hex values.
- Keep variant maps (`Record<Variant, string>`) at the top of the component file.
- Class merging goes through `cn()` (`src/utils/cn.ts`).
- One component per file; barrel export in `src/components/ui/index.ts`.
- Breakpoints: mobile-first — `sm: 640`, `md: 768`, `lg: 1024`. Tables hide secondary columns below `sm`/`lg` instead of overflowing.
- Interactive elements: rely on the global `:focus-visible` ring; disable pointer events with `disabled:opacity-50`.
