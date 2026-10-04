- **Selling prices live here, not on the product.** A product's `PurchasePrice` is its cost; what a
  customer pays comes from the price list for their market and currency. Read a product's prices with
  `include=Prices` on the product. *(unverified)*
- **`PUT PriceList/Price` is a bulk upsert whose 200 proves nothing.** Check `UpdateCount`, `Invalid`
  and `NotFound` in the response, and read the prices back. *(unverified)*
- **`ProductId` in a price write is a string**, unlike everywhere else. *(unverified)*
