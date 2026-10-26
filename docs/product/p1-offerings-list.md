# P1 – Offerings list

Branch: `feature/p1-offerings-list`

## Requirements

- The devotee picks a temple and sees its offerings with their prices.
- The devotee can search offerings by name.
- Inactive offerings are not offered for booking.
- Show the user what is happening while data loads, when nothing matches, and when a call fails.

## Acceptance criteria

- Typing "push" shows Pushpanjali and hides offerings that don't match.
- A failed load shows an error with a way to try again.
- At least one automated test.

## Open questions to decide in the PR

- Are inactive offerings hidden, or shown but not bookable?
- Is search case-insensitive and does it match anywhere in the name?
- Which temple is selected by default?
