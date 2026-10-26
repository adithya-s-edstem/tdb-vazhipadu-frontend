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
  `createOrder` prices lines from stored offerings, rejects inactive or other-temple offerings, non-positive
  quantities and offering dates before today, and returns status `confirmed`. Only `confirmed` orders can be
  cancelled. Responses and requests are deep-copied so callers never share objects with the store.
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

### D8: Offerings list shows only bookable offerings
- Status: accepted
- Ticket: #4
- Context: P1 leaves open whether inactive offerings are hidden or shown disabled, how search matches and which temple
  is selected first.
- Decision: inactive offerings are hidden (`isBookable` in `src/features/offerings/domain/` is the single rule).
  Search trims the input, ignores case and matches anywhere in the name. The first temple returned by `getTemples`
  is selected by default. Temple and search are component state, not URL state; the URL rule applies to staff list
  filters (P4). Queries retry once before showing an error with a "Try again" button.
- Alternatives: showing inactive offerings greyed out (adds a row the devotee cannot act on); prefix-only search
  (misses "Swayamvara Pushpanjali" for "push"); no automatic retry (with a 10% failure rate, one in ten loads would
  show an error).

### D9: Cart and order form rules
- Status: accepted
- Ticket: #5
- Context: P2 leaves open temple mixing, phone formats, the meaning of "today", quantity limits and form persistence.
- Decision: a cart holds offerings from one temple, because `createOrder` takes one `templeId`; adding from another
  temple is disabled with a notice until the cart is emptied. Quantity is 1 to 10 per line (`quantityLimits` in
  `src/features/cart/domain/`). Only the cart lines persist (Zustand `persist`, key `vazhipadu-cart`); the form does
  not, so a devotee's name and phone are not left on a shared phone. Phone accepts a 10-digit Indian mobile starting
  6–9, optionally prefixed `+91`, ignoring spaces and hyphens, and is submitted as the plain 10 digits. Today is a valid
  offering date; "today" is the devotee's local date, matching the server rule in D6. `@hookform/resolvers` v5 bridges
  React Hook Form and Zod 4 (v6 has an unresolvable optional peer conflict).
- Alternatives: per-temple carts (`createOrder` would need several calls and P3 one confirmation); replacing the cart
  silently when another temple's offering is added (loses the devotee's choices); persisting the form (stores personal
  details in local storage); accepting landlines (no format the staff can call back reliably).

### D10: Duplicate-safe order placement and inline confirmation
- Status: accepted
- Ticket: #6
- Context: P3 asks whether duplicate protection is UI-only or also on `createOrder`, and where the confirmation lives.
- Decision: both. `CreateOrderRequest` carries a required `idempotencyKey`; the server stores one order per key and
  returns that order again for a repeated key, and rejects a blank key with `invalid-request`. The checkout creates a
  key (`crypto.randomUUID`) on the first Place order, keeps it across failed attempts with the same cart and details,
  starts a new one when either changed, and drops it after a success. A success removes only the ordered quantities
  from the cart, so offerings added while the order was in flight stay.
  Place order is also disabled while a request is in flight. The confirmation (order number and total) shows inline
  above the cart and stays until the devotee chooses "Book more offerings"; it is not persisted, so a refresh shows
  the booking page with the already emptied cart. Failures show one message and keep the cart and form; the devotee
  retries with Place order. Mutations are not retried automatically.
- Alternatives: disabled button only (a double-click can send two requests before React re-renders, which the
  double-click test shows); rejecting a reused key whose request differs (no caller sends one, so it adds a rule with
  no user); a confirmation route (needs the order fetched by id, which the mock API has no operation for).
