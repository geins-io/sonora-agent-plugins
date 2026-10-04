- **`UseSalePrice` defaults to `true` when left out.** That is the admin's "Only include discounted
  products" toggle, so a promo code created without it silently applies to sale items only. Send
  `"UseSalePrice": false` unless the user asked for that restriction.
- **`CampaignTypeId` values belong to the account.** Read `Campaign/Types` and match by name; do not
  assume 3 is Percentage. Percentage types take `PercentageValue`, fixed-amount types take `Amounts`.
- **Amounts are objects keyed by currency**, for `Amounts`, `Prices` and `MinimumPurchaseAmounts`:
  `{"SEK": 50, "EUR": 5}`, never a bare number.
- **A code campaign (`CampaignBaseType` 2) needs a `PromoCode`; cart (1) and product (3) campaigns do
  not.** Leave `ProductSelection` out entirely on a code campaign rather than sending `null`.
  *(unverified)*
- **`CampaignBaseType`, `SaleTypesToEnforce` and `PriceOutput` read back as names** (`"code"`), though
  the spec shows numbers. Writes accept either form, so a read body can be sent back as it is.
  *(unverified)*
- **`UseSalePrice` is forced to `true` for every type except the percentage ones** (Percentage,
  Percentage on most expensive, Percentage on cheapest, Buy x get y percentage), whatever you send.
  Read it back and tell the user if they asked for `false` on another type.
- **Inside `ProductSelection`**, `Include`/`Exclude` use `Condition` 0 = AND, 1 = OR, and each price
  rule uses `Condition` 0 = less than, 1 = greater than, 2 = equal. *(unverified)*
