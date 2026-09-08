# Payment

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Payment/Query` | Query payment options |

## POST Payment/Query

Body: `Payment.Models.PaymentOptionQuery`

Returns: `Payment.Models.PaymentOption[]`

## Schemas

### Payment.Models.PaymentOptionQuery

| Field | Type | Required | Description |
|---|---|---|---|
| SiteId | integer (int32) |  |  |
| Email | string |  | Customer email address. |
| CustomerTypeId | integer (int32) |  |  |
| CountryId | integer (int32) |  |  |
| Sum | number (double) |  |  |

### Payment.Models.PaymentOption

| Field | Type | Required | Description |
|---|---|---|---|
| PaymentId | integer (int32) |  |  |
| PaymentGroupId | integer (int32) |  |  |
| Name | string |  |  |
| DisplayName | string |  |  |
| Fee | number (double) |  |  |
| Icon | string |  |  |
| Sort | integer (int32) |  |  |
| Period | integer (int32) |  |  |
| TermsLink | string |  |  |
| InfoLink | string |  |  |
| PersonalIdRequired | boolean |  |  |
| RegisteredAddressRequired | boolean |  |  |
| HouseNumberRequired | boolean |  |  |
| HouseExtensionShown | boolean |  |  |
| GenderRequired | boolean |  |  |
| BirthdateRequired | boolean |  |  |

