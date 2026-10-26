# P3 – Order confirmation

Branch: `feature/p3-order-confirmation`

## Requirements

- Submitting the order places it through the mock API.
- The devotee can't place the same order twice by tapping the button again.
- If the order fails, the devotee keeps their cart and form values and can try again.
- On success, show a confirmation with the order number and total, and empty the cart.

## Acceptance criteria

- Double-clicking Place order creates one order.
- After a failure, the cart and form are unchanged and a retry works.

## Open questions to decide in the PR

- Is duplicate protection UI-only (disabled button) or also an idempotency key on `createOrder`?
- Where does the confirmation live (route, modal, inline) and what happens on refresh?
