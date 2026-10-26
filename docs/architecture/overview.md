# Architecture overview

## Stack

| Concern | Choice | Why |
|---------|--------|-----|
| Build | Vite + React 18 + TypeScript strict | Mandated |
| Styling | Tailwind CSS | Preferred by brief; utility classes keep components self-contained |
| Routing | React Router | URL is the state store for staff filters (P4) |
| Server state | TanStack Query | Loading, error, retry, cache invalidation and mutations without hand-written state machines |
| Client state | Zustand with `persist` | Cart survives refresh (P2) without custom storage code |
| Forms | React Hook Form + Zod | Per-field validation messages (P2) and a single schema for types and rules |
| Tests | Vitest + React Testing Library + user-event | Preferred by brief; queries by role and label support P5 |

Prefer adding a well-known library over writing complex functionality. See the `style-plugins-first` skill.

## Layers

The app has a frontend and a backend even though both run in the browser. Dependencies point inward only.

```
ui (pages, components)
  -> features (hooks, view models)
    -> api client (typed functions returning Promises)
      -> backend (mock server: handlers -> services -> store, network simulation)
```

- **Backend** (`src/api/server/`): owns data, rules (cancellation, totals, idempotency) and network simulation.
  It never imports from the frontend.
- **API client** (`src/api/client/` and `src/api/types/`): the only paths the frontend may import. Exposes the
  operations in [../product/mock-api.md](../product/mock-api.md) and the shared types. Never import
  `src/api/server/` from the frontend.
- **Features** (`src/features/<feature>/`): one folder per problem area, containing hooks, components and tests.
  Frontend business rules (cart total, offering date not in the past) live in the feature's `domain/` folder as pure,
  framework-free functions; components and hooks call them and never re-implement them.
- **Shared** (`src/shared/`): formatting, generic UI primitives. Nothing feature-specific.

## Directory layout

```
src/
  app/                    router, providers, layout
  api/
    client/               one file per operation
    server/
      network/            latency and failure simulation
      seed/               temples, offerings, orders
      services/           one file per business rule set
      store/              in-memory collections
    types/                one file per domain type
  features/
    <feature>/domain/     pure business rules for that feature
    offerings/            P1
    cart/                 P2
    order-form/           P2
    checkout/             P3
    orders/               P4
  shared/
    format/
    ui/
test/                     setup and shared test helpers only
```

Tests live next to the unit they test: `formatRupees.ts` and `formatRupees.test.ts`.

## Cross-cutting rules

- Money is integer rupees end to end; format once, in `src/shared/format/`.
- Dates cross the API as ISO `YYYY-MM-DD` strings in the devotee's local date.
- Every async view handles three states: loading, empty, error with retry.
- URL search params are the source of truth for list filters and page.
