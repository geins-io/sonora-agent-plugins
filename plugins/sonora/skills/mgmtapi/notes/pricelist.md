- **Selling prices live here, not on the product.** A product's `PurchasePrice` is its cost; what a
  customer pays comes from the price list for their market and currency. Read a product's prices with
  `include=Prices` on the product. *(unverified)*
- **`PUT PriceList/Price` is a bulk upsert, and a 200 can still be a partial failure.** Unlike the
  product batch endpoints, it returns `UpdateCount`, `Invalid` and `NotFound` at the top level, not
  under `Resource`. Check `Invalid` and `NotFound`, and read the prices back. *(unverified)*
- **`ProductId` in a price write is a string**, because it carries whatever id type `productIdType`
  names. The read model has it as a number.
