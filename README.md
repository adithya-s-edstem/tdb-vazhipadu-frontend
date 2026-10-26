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

The foundation and each problem shipped as one merged PR, in problem order:

- M0 Foundation: [#9 Set up Vite app, tooling and mock API][pr-9]
- P1 Offerings list: [#10 Show offerings for the selected temple with search][pr-10]
- P2 Cart and order form: [#12 Add offering cart and order form][pr-12]
- P3 Order confirmation: [#13 Place order with confirmation and duplicate protection][pr-13]
- P4 Orders list: [#11 Add staff orders list with filters, pages and cancel][pr-11]
- P5 Mobile and accessibility: [#14 Make booking flow mobile friendly and accessible][pr-14]

[pr-9]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/9
[pr-10]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/10
[pr-12]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/12
[pr-13]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/13
[pr-11]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/11
[pr-14]: https://github.com/adithya-s-edstem/tdb-vazhipadu-frontend/pull/14
