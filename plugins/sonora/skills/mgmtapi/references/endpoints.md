# Sonora Management API endpoint index

Spec version v1.14.0, generated on 2026-09-25. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Open only the file for the resource you need.

| Resource | Endpoints | Paged query | File |
|---|---|---|---|
| Brand | 5 |  | [brand.md](./brand.md) |
| Campaign | 6 |  | [campaign.md](./campaign.md) |
| Category | 4 |  | [category.md](./category.md) |
| CustomerGroup | 5 |  | [customergroup.md](./customergroup.md) |
| Market | 2 |  | [market.md](./market.md) |
| Order | 20 | yes | [order.md](./order.md) |
| PageArea | 7 |  | [pagearea.md](./pagearea.md) |
| Payment | 1 |  | [payment.md](./payment.md) |
| PriceList | 6 |  | [pricelist.md](./pricelist.md) |
| Product | 33 | yes | [product.md](./product.md) |
| ProductImage | 5 |  | [productimage.md](./productimage.md) |
| ProductParameter | 13 |  | [productparameter.md](./productparameter.md) |
| Redirect | 2 |  | [redirect.md](./redirect.md) |
| Refund | 9 |  | [refund.md](./refund.md) |
| Return | 4 |  | [return.md](./return.md) |
| Shipping | 5 |  | [shipping.md](./shipping.md) |
| Sitemap | 1 |  | [sitemap.md](./sitemap.md) |
| Supplier | 4 |  | [supplier.md](./supplier.md) |
| User | 11 | yes | [user.md](./user.md) |
| Variant | 15 |  | [variant.md](./variant.md) |
| Webhook | 5 |  | [webhook.md](./webhook.md) |

Read the `Returns` line before parsing a response. Most endpoints wrap the payload in an envelope, under `Resource` alongside `Message` and `Details`, but an unpaged `Query` returns a bare array.

A resource marked "paged query" exposes `POST {Resource}/Query/{page}`, which is what `Get-SonoraApi.ps1 -All` walks. The rest expose only the unpaged `POST {Resource}/Query`.
