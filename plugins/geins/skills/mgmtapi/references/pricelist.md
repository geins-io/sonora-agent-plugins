# PriceList

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `PriceList` | Create a new price list |
| DELETE | `PriceList/{id}` | Delete a price list |
| GET | `PriceList/{id}` | Get a price list by id |
| PUT | `PriceList/{id}` | Update a price list |
| GET | `PriceList/List` | List price lists |
| PUT | `PriceList/Price` | Update price list prices |

## POST PriceList

Creates a new price list definition.

Body: `PriceList.Models.Write.PriceList`

Returns: `Envelope-PriceList.Models.Read.PriceList`

## DELETE PriceList/{id}

Deletes a price list definition. Only custom price lists are supported.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the price list to delete. |

Returns: `BaseEnvelope`

## GET PriceList/{id}

Returns a price list definition by id. Only custom price lists are supported.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the price list. |

Returns: `Envelope-PriceList.Models.Read.PriceList`

## PUT PriceList/{id}

Updates an existing price list definition. Only custom price lists are supported.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the price list to update. |

Body: `PriceList.Models.Write.PriceList`

Returns: `BaseEnvelope`

## GET PriceList/List

Gets all price list definitions. - Prices on campaign price lists (id: xxxxxx2) can not be updated. Any such entries will be ignored. - ID for Ordinary, Sale and Campaign price lists starts from 1000000. The ID is calculated by this formula, Market ID * 1000000 + Type of price list (Ordinary=0, Sale=1, Capaign=2) Eg: Ordinary price list for market with ID 1 has ID = 1000000 Sale price list for market with ID 1 has ID = 1000001 Campaign price list for market with ID 1 has ID = 1000002 Ordinary price list for market with ID 2 has ID = 2000000

Returns: `PriceList.Models.Read.PriceList[]`

## PUT PriceList/Price

Updates price list prices. - Prices on campaign price lists (id: xxxxxx2) can not be updated. Any such entries will be ignored. - ID for Ordinary, Sale and Campaign price lists starts from 1000000. The ID is calculated by this formula, Market ID * 1000000 + Type of price list (Ordinary=0, Sale=1, Capaign=2) Eg: Ordinary price list for market with ID 1 has ID = 1000000 Sale price list for market with ID 1 has ID = 1000001 Campaign price list for market with ID 1 has ID = 1000002 Ordinary price list for market with ID 2 has ID = 2000000 To remove a price, set the price to -1. This only applies to custom price lists.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| pricesIncVat | query | boolean |  | Set to true if prices includes VAT. Leave blank or set to false if they exclude VAT. |

Body: `PriceList.Models.Write.PriceListPrice[]`

Returns: `PriceList.Models.PriceListPriceResponse`

## Schemas

### PriceList.Models.Write.PriceList

A price list definition.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | Price list name. |
| MarketId | integer (int32) |  | Market id. |
| Forced | boolean |  | When true, prices from this price list are used regardless if the ordinary price is lower. |
| AssignedCustomerGroups | integer (int32)[] |  | Should contain a list of customer group ids that this price list is assigned to. |
| Identifier | string |  | A custom identifier for this price list that can be used instead of the id in some situations. |
| Active | boolean |  | Indicates if this price list is active. |

### Envelope-PriceList.Models.Read.PriceList

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | PriceList.Models.Read.PriceList |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### PriceList.Models.Read.PriceList

A price list definition.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Price list id. |
| Name | string |  | Price list name. |
| MarketId | integer (int32) |  | Market id. |
| MarketPrefix | string |  | Market prefix. Eg: SE. |
| Currency | string |  | Currency abbreviation. Eg: SEK. |
| Forced | boolean |  | When true, prices from this price list are used regardless if the ordinary price is lower. |
| CreatedAt | string (date-time) |  | When the price list was created. |
| Identifier | string |  | A custom identifier for this price list that can be used instead of the id in some situations. |
| Active | boolean |  | Indicates if this price list is active. |

### PriceList.Models.Write.PriceListPrice

A price for a product on a specific price list.

| Field | Type | Required | Description |
|---|---|---|---|
| PriceListId | integer (int32) |  | The price list id. Prices on Campaign price lists can not be updated. Any such entries will be ignored. |
| Price | number (double) |  | The price in the currency of the associated price list. This value can be either inc or ex VAT, depending on configuration. |
| ProductId | string |  | The id of the product that this price applies to. This value can represent different fields, depending on configuration. |
| Currency | string |  | The 3-letter ISO 4217 currency code for this price. If ommitted the price will be updated on the default market. |
| StaggeredCount | integer (int32) |  | Staggered count for this price. Defaults to 1. This field is ignored for prices on default (Ordinary, Sale and Campaign) price lists. |

### PriceList.Models.PriceListPriceResponse

The response of a PriceListPrice request.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | PriceList.Models.Write.PriceListPrice[] |  | Supplied PriceList prices that failed validation. |
| NotFound | PriceList.Models.Write.PriceListPrice[] |  | Supplied PriceList prices that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of price updates resulting from the request. |

