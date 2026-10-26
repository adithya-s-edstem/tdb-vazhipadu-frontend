# P2 – Offering cart and order form

Branch: `feature/p2-cart-and-order-form`

## Requirements

- The devotee adds offerings to a cart, changes quantities and removes items.
- The cart shows each line and the total, in Indian rupees.
- The cart is still there after a page refresh.
- The order form asks for the devotee's name, phone number, birth star (nakshatra, from a list of the 27 stars) and the
  date of the offering.
- Validate the form before it is sent. The date can't be in the past.

## Acceptance criteria

- 2 Pushpanjali at ₹30 and 1 Archana at ₹50 shows a total of ₹110.
- The form shows a message next to each invalid field.
- Refreshing the page keeps the cart.

## Open questions to decide in the PR

- Can a cart hold offerings from more than one temple?
- What phone formats are valid (10-digit Indian mobile, optional +91)?
- Is today a valid offering date? Which timezone defines "today"?
- Quantity limits (minimum 1, maximum?).
- Does the form persist across refresh as well, or only the cart?
