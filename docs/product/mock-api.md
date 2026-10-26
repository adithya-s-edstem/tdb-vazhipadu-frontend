# Mock API

A typed module in `src/api/` that keeps data in memory and behaves like a real network.

## Behaviour

- Every call returns a `Promise` and resolves after a random **200–1000 ms**.
- Every call fails at a configurable rate, default **10%**, by rejecting with an error.
- Tests must be able to set latency to zero and the failure rate to 0 or 1 to make behaviour deterministic:
  `configureMockApi({ minLatencyMs, maxLatencyMs, failureRate })` and `resetMockApi()` from `src/api/client`.

## Seed data

- At least **2 temples**, each with **8–10 offerings** (`name`, `price`, `active` flag).
- One temple must include **Pushpanjali at ₹30** and **Archana at ₹50** (used by acceptance criteria).
- At least one inactive offering per temple.
- Around **50 existing orders** across statuses and dates.

## Operations

| Function | Purpose |
|----------|---------|
| `getTemples()` | List temples |
| `getOfferings(templeId)` | A temple's offerings |
| `createOrder(request)` | Place an order with one or more offerings |
| `getOrders(query)` | List orders, with filters and pages |
| `cancelOrder(orderId)` | Cancel an order |

Types live in `src/api/types/`: `Temple`, `Offering`, `CreateOrderRequest`, `Order`, `OrdersQuery`, `OrdersPage`,
`ApiError`. Query defaults and error codes are recorded in
[D6 and D7](../architecture/decisions.md#d6-mock-api-errors-and-order-rules).

Signatures may change (for example, adding parameters) when a problem needs it. Explain the change in the PR and record
it in [../architecture/decisions.md](../architecture/decisions.md).

## Contract notes

- Money is stored as integer rupees. Formatting to `₹` happens only in the UI.
- `createOrder` must be safe against duplicate submission (see [P3](p3-order-confirmation.md)). Every request carries
  an `idempotencyKey`; resending a key returns the order already placed with it instead of a new one
  ([D10](../architecture/decisions.md#d10-duplicate-safe-order-placement-and-inline-confirmation)).
- `getOrders` returns a page of results plus the total count so the UI can render pagination.
