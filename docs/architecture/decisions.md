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
