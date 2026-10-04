- **VAT is `Vat` plus `VatType`, always both.** `{"Vat": 2, "VatType": "VatId"}` sets VAT id 2;
  `{"Vat": 12, "VatType": "Actual"}` sets a 12 % rate, given as a percentage, not `0.12`. `Vat`
  without `VatType` is a 400 `Missing VatType`. A `VatId` field in the body is **silently ignored**:
  2xx, VAT unchanged. Reads return both `Vat` (the rate as a fraction, `0.25`) and `VatId`.
- **`PUT Product/{id}` merges.** Fields left out stay as they are, and localized lists (`Names`,
  `ShortTexts`, `LongTexts`, `TechTexts`) merge by `LanguageCode`: sending only `en` leaves `sv`
  untouched.
- **`CategoryIds` replaces the whole set, and its first id is the main category.** `MainCategoryId` in
  a write is silently ignored; reorder `CategoryIds` instead. There is no endpoint that removes a
  single category, so read the current set, drop the id, and write the rest back.
- **Parent categories are added for you.** Assigning `[10, 2]`, where 2 sits under 1, reads back as
  `[10, 2, 1]`. So removing a parent while one of its children stays assigned should be a no-op;
  read back to check. *(unverified)*
- **`include=Parameters`, not `ParameterValues`.** The latter is a 400 `Invalid include`; `Parameters`
  is what fills the `ParameterValues` field. An empty `include=` is a 400 too.
- **A new product has no items, so it cannot hold stock.** Create an item first, then set stock on
  the item. `StockType` 0 is Available, the warehouse count you normally mean; 1 is Oversellable,
  2 is Static. *(unverified)*
- **`PurchasePrice` is the cost price, not what customers pay.** Selling prices live in price lists,
  scoped by market and currency; see `pricelist.md`.
