# Lesotho Football Hub (LFH)

A professional football management and live match platform for Lesotho — live fixtures, league tables, clubs, players and statistics, presented with the quality of a national football association product.

> **Status:** Foundation + Design System (Chunks 1–2). Application features are built incrementally in later chunks.

## Technology stack

| Layer | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (design tokens defined in CSS `@theme`) |
| Routing | React Router 7 |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) — configured in later chunks |
| Charts | Recharts |
| Icons | Lucide React |

## Getting started

```bash
npm install
npm run dev        # start dev server
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck  # TypeScript only
```

Copy `.env.example` to `.env` and fill in Supabase credentials when the backend chunks arrive.

The app currently serves the design system gallery at `/design-system` (root redirects there until the home page is built).

## Project structure

```
src/
├── assets/        # static assets (logos, images, fonts)
├── components/
│   └── ui/        # design system — the only place shared UI is defined
├── config/        # app constants and route definitions
├── features/      # feature modules (fixtures, tables, players, …)
├── hooks/         # shared React hooks (useClickOutside, useEscapeKey, …)
├── layouts/       # page shells (public site, dashboards)
├── pages/         # route-level pages
├── services/      # Supabase client and API services
├── styles/        # global styles and design tokens (index.css)
├── types/         # shared TypeScript types
└── utils/         # pure helpers (cn, pagination, …)
```

Conventions:

- Everything is TypeScript; no `any` without a written justification.
- Shared UI lives in `src/components/ui` — pages never re-implement a component that exists there.
- Styling uses design tokens (`bg-surface`, `text-ink`, `border-line`, `bg-live`, …) and semantic typography classes (`.page-title`, `.score-display`, …). Raw hex colours are forbidden outside `src/styles/index.css`.
- Route paths are declared once in `src/config/app.ts`.

## Design system

The full token and component reference lives in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and is demonstrated live at `/design-system`.

- **Colour:** deep navy (background/navigation), white/grey (content surfaces), blue (primary actions), green (live/positive), orange (highlights/notifications), red (errors/destructive).
- **Typography:** Barlow Condensed for display (titles, scores, team names, statistics), Inter for interface and body copy.
- **Components (18):** Button, NavNavLink, Card, MatchCard, ClubBadge, PlayerCard, LeagueTable, StatisticCard, StatusBadge, Tabs, SearchField, Select, Modal, Table, Pagination, Toast (notifications), EmptyState, Spinner + Skeleton.

## Development roadmap

| Chunk | Deliverable | Status |
| --- | --- | --- |
| 1 | Project foundation, architecture, folder structure | ✅ |
| 2 | Design system: tokens, typography, 18 reusable components | ✅ |
| 3 | Supabase project, schema, RLS, auth flows | ⏳ |
| 4 | Public website: home, fixtures, tables, clubs, players | ⏳ |
| 5 | Live match centre with Supabase Realtime | ⏳ |
| 6 | Role-based dashboards (admin, club official, referee, viewer) | ⏳ |
| 7 | Management modules (fixtures, results, players, media) | ⏳ |
| 8 | Statistics & charts (Recharts), notifications, polish | ⏳ |

Dependencies: the design system (2) precedes all UI work (4–8); Supabase (3) is required by live features (5) and dashboards (6–7); statistics (8) depend on data from 3 and 7.
