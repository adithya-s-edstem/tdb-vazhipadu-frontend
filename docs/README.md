# Docs

Single source of truth for what we build and how. Tickets link here instead of restating requirements.

| Area | File | Read when |
|------|------|-----------|
| Product | [product/overview.md](product/overview.md) | Always, before any ticket |
| Product | [product/mock-api.md](product/mock-api.md) | Touching `src/api/` or any data call |
| Product | [product/p1-offerings-list.md](product/p1-offerings-list.md) | P1 tickets |
| Product | [product/p2-cart-and-order-form.md](product/p2-cart-and-order-form.md) | P2 tickets |
| Product | [product/p3-order-confirmation.md](product/p3-order-confirmation.md) | P3 tickets |
| Product | [product/p4-orders-list.md](product/p4-orders-list.md) | P4 tickets |
| Product | [product/p5-mobile-and-accessibility.md](product/p5-mobile-and-accessibility.md) | P5 tickets |
| Architecture | [architecture/overview.md](architecture/overview.md) | Before writing code |
| Architecture | [architecture/decisions.md](architecture/decisions.md) | Before making or changing a decision |
| Process | [process/workflow.md](process/workflow.md) | Branching, commits, PRs, reviews, merges |
| Process | [process/milestones.md](process/milestones.md) | Planning and creating tickets |

## Rules for docs

- Docs describe intent and contracts. Code describes implementation.
- Link to a section with an anchor (`docs/product/p1-offerings-list.md#acceptance-criteria`) rather than copying text into tickets.
- When a ticket forces a decision the docs do not cover, add it to `architecture/decisions.md` in the same PR.
