# Market

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| GET | `Market/{marketId}` | Get market |
| GET | `Market/List` | List markets |

## GET Market/{marketId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| marketId | path | string | yes | The id of the market to get. |
| marketIdType | query | enum(0, 1) |  | The type of market id supplied. 0 = Internal. Internal market id set by Geins. 1 = Name. The name of the market. |

Returns: `Envelope-Market.Models.Market`

## GET Market/List

Gets a list of all markets

Returns: `Market.Models.Market[]`

## Schemas

### Envelope-Market.Models.Market

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Market.Models.Market |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Market.Models.Market

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Market id. |
| ChannelId | string |  | Channel id. Format: {Id}\|{MarketTopDomain} |
| Name | string |  | Market Name. |
| DisplayName | string |  | Market display name. |
| Url | string |  | Market url. |
| Currency | string |  | Default currency iso code of the market. |
| VatRate | number (double) |  | Default VAT Rate of the market. |
| MarketPrefix | string |  | Market prefix. Usually the top level domain of the market. |
| CountryId | integer (int32) |  | Default country Id of the market. |
| CurrencyId | integer (int32) |  | Default currency Id of the market. |
| CurrencyRate | number (double) |  | Currency rate of the default currency. |
| LanguageId | integer (int32) |  | Default language Id of the market. |
| Language | string |  | Default language iso code of the market. |
| Languages | Market.Models.LanguageItem[] |  | All languages of the market. |
| Countries | Market.Models.CountryItem[] |  | All countries of the market. |
| Currencies | Market.Models.CurrencyItem[] |  | All currencies of the market. |

### Market.Models.LanguageItem

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageId | integer (int32) |  | Language id. |
| Name | string |  | Language Name |
| Code | string |  | ISO code of the language. |

### Market.Models.CountryItem

| Field | Type | Required | Description |
|---|---|---|---|
| CountryId | integer (int32) |  | Country id. |
| Name | string |  | Country Name |
| Code | string |  | ISO code of the country. |
| VatRate | number (double) |  | VAT Rate of the country. |
| CurrencyId | integer (int32) |  | Currency id of the country. |

### Market.Models.CurrencyItem

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | Currency Name. |
| Code | string |  | Iso code of the currency. |
| CurrencyId | integer (int32) |  | Currency id. |
| CurrencyRate | number (double) |  | Currency rate. |

