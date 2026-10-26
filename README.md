# tdb-vazhipadu-frontend

A vazhipadu (temple offering) booking app for devotees and temple staff. React 18, TypeScript strict, Vite,
Tailwind CSS, with an in-app mock API instead of a real backend.

Requirements and architecture live in [docs/](docs/README.md).

## Requirements

- Node.js 22.22 or newer (24 LTS recommended)
- npm 10 or newer

## Run the app

```
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Run the checks

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm test`          | Vitest in watch mode                                             |
| `npm test -- --run` | Vitest once, as CI runs it                                       |
| `npm run lint`      | ESLint (120-character lines, 400-line files) and Prettier check  |
| `npm run format`    | Prettier rewrite                                                 |
| `npm run build`     | Type-check with `tsc -b`, then build for production into `dist/` |

## Mock API

All data comes from `src/api/`. Frontend code imports only from `src/api/client` and `src/api/types`.

| Operation                | Returns                                               |
| ------------------------ | ----------------------------------------------------- |
| `getTemples()`           | `Temple[]`                                            |
| `getOfferings(templeId)` | `Offering[]` for that temple, inactive ones included  |
| `createOrder(request)`   | The placed `Order`, priced by the server              |
| `getOrders(query)`       | `OrdersPage`: one page of orders plus the total count |
| `cancelOrder(orderId)`   | The cancelled `Order`                                 |

Every call resolves after 200–1000 ms and fails 10% of the time with an `ApiError` whose `code` is `network`.
Rule violations reject with `not-found`, `invalid-request` or `conflict`.

Tests make the API deterministic with `configureMockApi` and `resetMockApi` from `src/api/client`:

```ts
resetMockApi();
configureMockApi({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
```

`test/useInstantMockApi.ts` does this before every test in a file.

## Pull requests

Each problem ships as one PR, linked here as it is opened.
