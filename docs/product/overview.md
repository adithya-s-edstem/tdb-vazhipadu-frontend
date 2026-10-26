# Product overview

## What we are building

A small **vazhipadu (temple offering) booking app** for a temple board.

A vazhipadu is a ritual offering a devotee pays the temple to perform. The devotee pays a fixed fee and the priest
performs the ritual, usually in the name of a person and their birth star.

## Users

| User | Goal |
|------|------|
| Devotee | Pick a temple, choose offerings, fill a short form, place an order. Mostly on a phone. |
| Temple staff | Look up, filter and cancel orders. |

## Delivery

Five problems, each shipped as one branch, one PR, one review and one merge, in order P1 to P5.

| # | Problem | Spec |
|---|---------|------|
| P1 | Offerings list | [p1-offerings-list.md](p1-offerings-list.md) |
| P2 | Offering cart and order form | [p2-cart-and-order-form.md](p2-cart-and-order-form.md) |
| P3 | Order confirmation | [p3-order-confirmation.md](p3-order-confirmation.md) |
| P4 | Orders list | [p4-orders-list.md](p4-orders-list.md) |
| P5 | Mobile and accessibility | [p5-mobile-and-accessibility.md](p5-mobile-and-accessibility.md) |

## Hard constraints

- React 18+, TypeScript strict mode, Vite.
- Tailwind CSS for styling. Vitest with React Testing Library for tests.
- No real backend. All data comes from the in-app mock API: [mock-api.md](mock-api.md).
- Time box: 90 minutes for all five problems including PRs, reviews and merges.
- `npm run build` and the tests pass with zero TypeScript errors.
- Public repo `tdb-vazhipadu-frontend`. README explains how to run the app and tests, and links all 5 PRs.
- No direct commits to `main`. Every change, including setup, ships through an issue and a PR.

## What is assessed

Working features that meet the acceptance criteria, edge cases, meaningful tests, clean code, Git and PR discipline.
Every gap in a spec is a decision: record it in the PR's **Assumptions** section and, if it outlives the PR, in
[../architecture/decisions.md](../architecture/decisions.md).
