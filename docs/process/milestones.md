# Milestones

Every problem in the brief is exactly **one milestone, one issue, one branch, one PR**. Never split a problem into
several issues, and never create a second issue for a problem that already has one: update the existing issue instead.

| Milestone | Issue scope | Spec | Branch | Depends on |
|-----------|-------------|------|--------|------------|
| M0 Foundation | Vite scaffold, tooling, Tailwind, test setup, mock API, README | [mock-api](../product/mock-api.md), [architecture](../architecture/overview.md) | `feature/m0-foundation` | – |
| M1 Offerings list | P1 | [p1](../product/p1-offerings-list.md) | `feature/p1-offerings-list` | M0 |
| M2 Cart and order form | P2 | [p2](../product/p2-cart-and-order-form.md) | `feature/p2-cart-and-order-form` | M1 |
| M3 Order confirmation | P3 | [p3](../product/p3-order-confirmation.md) | `feature/p3-order-confirmation` | M2 |
| M4 Orders list | P4 | [p4](../product/p4-orders-list.md) | `feature/p4-orders-list` | M0 |
| M5 Mobile and accessibility | P5 | [p5](../product/p5-mobile-and-accessibility.md) | `feature/p5-mobile-and-accessibility` | M1, M2, M3 |

M4 only depends on the foundation, so it can be **implemented** in parallel with M1–M3. It is still **merged** after
P3 to keep PR order P1 to P5.

## Work outside the problems

Docs and tooling changes that are not part of a problem still get their own issue and PR, without a
milestone. Never commit to `main` directly, not even for docs.
