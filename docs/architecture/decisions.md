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
- Ticket: setup
- Context: the brief forbids a real backend but asks for network-like behaviour.
- Decision: an in-memory server module with simulated latency and failures, called only through `src/api/client/`.
- Alternatives: MSW (adds a service worker for no extra value in tests that already control the module directly).
