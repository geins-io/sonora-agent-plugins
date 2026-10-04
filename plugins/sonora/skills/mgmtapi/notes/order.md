- **If `Order/Query` answers 500 `A database error occured.`, add a `StatusList`.** Another account
  has been seen to reject queries without `StatusList` or `CustomerId`, and to reject the `inactive`
  and `pending` statuses the spec lists as valid. Labs accepts all of these, so treat this as a
  fallback when a query fails, not a rule to apply up front. *(unverified)*
