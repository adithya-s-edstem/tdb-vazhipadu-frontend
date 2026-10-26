# Decisions

Append-only log. One entry per decision that outlives a single PR. Newest at the bottom.

## Template

```
### D<n>: <title>
- Status: accepted | superseded by D<m>
- Ticket: #<issue>
- Context: what forced the decision (one or two lines)
- Decision: what we chose
- Alternatives: what we rejected and why
```

## Log

### D1: Mock API runs in-process behind a typed client
- Status: accepted
- Ticket: #1
- Context: the brief forbids a real backend but asks for network-like behaviour.
- Decision: an in-memory server module with simulated latency and failures, called only through `src/api/client/`.
- Alternatives: MSW (adds a service worker for no extra value in tests that already control the module directly).

### D2: TanStack Query for server state
- Status: accepted
- Ticket: #1
- Context: every view needs loading, error, retry, cache invalidation and mutations against the mock API.
- Decision: TanStack Query owns all server state.
- Alternatives: SWR (weaker mutation and invalidation support); hand-written fetch state (reinvents caching and retry).

### D3: Zustand with persist for client state
- Status: accepted
- Ticket: #1
- Context: the cart must survive a refresh (P2) without custom storage code.
- Decision: a Zustand store with the `persist` middleware.
- Alternatives: Redux Toolkit with redux-persist (more boilerplate for one small store); React context with manual
  localStorage sync (hand-rolled storage sync).

### D4: React Hook Form with Zod for forms
- Status: accepted
- Ticket: #1
- Context: P2 needs per-field validation messages, and form types should not drift from their rules.
- Decision: React Hook Form with a Zod schema per form, inferring the form type from the schema.
- Alternatives: Formik with Yup (less maintained, more re-renders, types not inferred from the schema).

### D5: date-fns for date arithmetic
- Status: accepted
- Ticket: #3
- Context: the seed spreads orders over past and future days, and later problems compare offering dates with today.
- Decision: date-fns for adding days, start of day and `YYYY-MM-DD` formatting.
- Alternatives: Day.js (mutable-looking plugin API, weaker tree-shaking); hand-written `Date` maths (time zone and
  month-boundary bugs).

### D6: Mock API errors and order rules
- Status: accepted
- Ticket: #3
- Context: the UI must tell a retryable network failure from a rule violation, and the server must own prices.
- Decision: every rejection is an `ApiError` with `code` `network`, `not-found`, `invalid-request` or `conflict`.
  `createOrder` prices lines from stored offerings, rejects inactive or other-temple offerings and non-positive
  quantities, and returns status `confirmed`. Only `confirmed` orders can be cancelled. Responses and requests are
  deep-copied so callers never share objects with the store.
- Alternatives: plain `Error` with messages (UI would parse strings); trusting client-sent prices (tamperable).

### D7: getOrders query defaults
- Status: accepted
- Ticket: #3
- Context: P4 needs filters, pages and a total count; its open questions are not decided yet.
- Decision: optional `status`, `offeringDate` (single `YYYY-MM-DD` day) and `phone` (partial match, spaces ignored);
  `page` is 1-based, `pageSize` defaults to 10; newest placed first. A page past the end returns no orders and the
  real total. A `page` or `pageSize` that is not a whole number of at least 1 rejects with `invalid-request`.
  P4 may extend this.
- Alternatives: cursor pagination (no page numbers for the URL); returning all orders and paging in the UI (does not
  behave like a real API).
