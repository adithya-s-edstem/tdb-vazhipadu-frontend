# P4 – Orders list

Branch: `feature/p4-orders-list`

Temple staff use this screen to look up orders.

## Requirements

- List orders with their date, devotee name, offerings, total and status.
- Filter by date and status, and search by phone number.
- Show the orders in pages.
- The filters and page survive a page refresh.
- Staff can cancel an order after confirming.

## Acceptance criteria

- Filtering by status shows only matching orders and goes back to page 1.
- Refreshing the page keeps the filters and the current page.
- A cancelled order shows as cancelled without reloading the page.

## Open questions to decide in the PR

- Is the date filter a single day or a range? Offering date or order-placed date?
- Page size, and what happens when the current page becomes empty after filtering or cancelling.
- Can an already cancelled or past order be cancelled?
- Is phone search exact or partial?
