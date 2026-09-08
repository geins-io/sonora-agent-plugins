# Campaign

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Campaign` | Creates a new campaign. |
| DELETE | `Campaign/{id}` | Deletes a campaign. |
| GET | `Campaign/{id}` | Gets a campaign by ID. |
| PUT | `Campaign/{id}` | Updates a campaign. |
| GET | `Campaign/List` | Lists all campaigns. |
| GET | `Campaign/Types` | Gets all campaign types. |

## POST Campaign

Body: `CampaignDetailItemBase`

Returns: `Envelope-CampaignDetailItem`

## DELETE Campaign/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | string (uuid) | yes | The campaign ID. |

Returns: `BaseEnvelope`

## GET Campaign/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | string (uuid) | yes | The campaign ID. |

Returns: `Envelope-CampaignDetailItem`

## PUT Campaign/{id}

If the campaign does not exist, it will be created. Partial updates are not supported.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | string (uuid) | yes | The campaign ID. |

Body: `CampaignDetailItemBase`

Returns: `BaseEnvelope`

## GET Campaign/List

Returns: `Envelope-List-CampaignListItem`

## GET Campaign/Types

Returns: `Envelope-List-CampaignTypeItem`

## Schemas

### CampaignDetailItemBase

Base class for campaign detail items.

| Field | Type | Required | Description |
|---|---|---|---|
| CampaignId | string (uuid) |  | Campaign ID. |
| CampaignBaseType | enum(0, 1, 2, 3) |  | Campaign base type. Allowed values are `code`, `cart`, and `product`. 0 = NOT_SET 1 = cart 2 = code 3 = product |
| Title | LocalizedItem[] |  | Localized titles. |
| Description | string |  | Description. |
| MarketId | string |  | Market ID. |
| CampaignTypeId | integer (int32) |  | Campaign type ID. Fetch available campaign types from the `campaign/types` endpoint. |
| BuyQuantity | integer (int32) |  | Buy quantity. |
| Amounts | object |  | Amounts. Key is ISO Currency code. Used by campaign types with an amount discount. |
| PayForQuantity | integer (int32) |  | Pay for quantity. |
| Priority | integer (int32) |  | Priority. |
| StopCombining | boolean |  | Indicates whether to stop combining. |
| ValidFrom | string (date-time) |  | Valid from date. |
| ValidTo | string (date-time) |  | Valid to date. |
| PromoCode | string |  | Promo code. |
| HideTitle | boolean |  | Indicates whether to hide the title. |
| CantCombineWithCartCampaign | boolean |  | Indicates whether the campaign cannot be combined with cart campaigns. |
| PercentageValue | number (double) |  | Percentage value. |
| ExcludeProductsOnSale | boolean |  | Indicates whether to exclude products on sale. |
| SaleTypesToEnforce | enum(0, 1, 2, 3) |  | Sale types to enforce. Possible values are `campaign`, `sale`, and `all`. 0 = NOT_SET 1 = campaign 2 = sale 3 = all |
| MinimumPurchaseAmounts | object |  | Minimum purchase amounts. |
| MinimumQuantity | integer (int32) |  | Minimum quantity. |
| CheckMinAmountAfterDiscounts | boolean |  | Indicates whether to check minimum amount after discounts. |
| Scoped | boolean |  | Toggles whether the campaign minimum requirements are scoped to the selected products only. |
| OncePerCustomer | boolean |  | Indicates whether the campaign is limited to once per customer. |
| UseSalePrice | boolean |  | Indicates whether to use the sale price when calculating campaign price. |
| FreeShipping | boolean |  | Indicates whether free shipping is included. |
| UsageLimit | integer (int32) |  | Usage limit. |
| Prices | object |  | Prices. Can be used with percentage campaign type. |
| LandingPage | CampaignLandingPage |  |  |
| SelectedUsers | string[] |  | Selected users, usually an array of email addresses. |
| SelectedGroups | string[] |  | Selected groups, usually an array of customer group IDs. |
| Enabled | boolean |  | Indicates whether the campaign is enabled. |
| ProductSelection | ProductSelection |  |  |
| Group | string |  | Group. Use it to group similar campaigns. |
| PriceOutput | enum(0, 1) |  | Price output type. 0 = Campaign 1 = Sale |

### Envelope-CampaignDetailItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | CampaignDetailItem |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-CampaignListItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | CampaignListItem[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-CampaignTypeItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | CampaignTypeItem[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### LocalizedItem

Represents a localized item with language and value.

| Field | Type | Required | Description |
|---|---|---|---|
| Language | string |  | The language of the localized item. |
| Value | string |  | The value of the localized item. |

### CampaignLandingPage

Represents a campaign landing page.

| Field | Type | Required | Description |
|---|---|---|---|
| Title | LocalizedItem[] |  | Localized titles for the landing page. |
| Url | ExtendedLocalizedItem[] |  | Localized URLs for the landing page. These can not be set directly, but are generated from the title. |
| Description | LocalizedItem[] |  | Localized descriptions for the landing page. |
| Meta | CampaignLandingPageMeta |  |  |

### ProductSelection

Represents the product selection criteria.

| Field | Type | Required | Description |
|---|---|---|---|
| Include | ProductSelectionData |  |  |
| Exclude | ProductSelectionData |  |  |

### CampaignDetailItem

| Field | Type | Required | Description |
|---|---|---|---|
| CampaignNumber | integer (int32) |  |  |
| Status | string |  |  |
| RoundingMethod | string |  |  |
| ContractVersion | string |  |  |
| CampaignId | string (uuid) |  | Campaign ID. |
| CampaignBaseType | enum(0, 1, 2, 3) |  | Campaign base type. Allowed values are `code`, `cart`, and `product`. 0 = NOT_SET 1 = cart 2 = code 3 = product |
| Title | LocalizedItem[] |  | Localized titles. |
| Description | string |  | Description. |
| MarketId | string |  | Market ID. |
| CampaignTypeId | integer (int32) |  | Campaign type ID. Fetch available campaign types from the `campaign/types` endpoint. |
| BuyQuantity | integer (int32) |  | Buy quantity. |
| Amounts | object |  | Amounts. Key is ISO Currency code. Used by campaign types with an amount discount. |
| PayForQuantity | integer (int32) |  | Pay for quantity. |
| Priority | integer (int32) |  | Priority. |
| StopCombining | boolean |  | Indicates whether to stop combining. |
| ValidFrom | string (date-time) |  | Valid from date. |
| ValidTo | string (date-time) |  | Valid to date. |
| PromoCode | string |  | Promo code. |
| HideTitle | boolean |  | Indicates whether to hide the title. |
| CantCombineWithCartCampaign | boolean |  | Indicates whether the campaign cannot be combined with cart campaigns. |
| PercentageValue | number (double) |  | Percentage value. |
| ExcludeProductsOnSale | boolean |  | Indicates whether to exclude products on sale. |
| SaleTypesToEnforce | enum(0, 1, 2, 3) |  | Sale types to enforce. Possible values are `campaign`, `sale`, and `all`. 0 = NOT_SET 1 = campaign 2 = sale 3 = all |
| MinimumPurchaseAmounts | object |  | Minimum purchase amounts. |
| MinimumQuantity | integer (int32) |  | Minimum quantity. |
| CheckMinAmountAfterDiscounts | boolean |  | Indicates whether to check minimum amount after discounts. |
| Scoped | boolean |  | Toggles whether the campaign minimum requirements are scoped to the selected products only. |
| OncePerCustomer | boolean |  | Indicates whether the campaign is limited to once per customer. |
| UseSalePrice | boolean |  | Indicates whether to use the sale price when calculating campaign price. |
| FreeShipping | boolean |  | Indicates whether free shipping is included. |
| UsageLimit | integer (int32) |  | Usage limit. |
| Prices | object |  | Prices. Can be used with percentage campaign type. |
| LandingPage | CampaignLandingPage |  |  |
| SelectedUsers | string[] |  | Selected users, usually an array of email addresses. |
| SelectedGroups | string[] |  | Selected groups, usually an array of customer group IDs. |
| Enabled | boolean |  | Indicates whether the campaign is enabled. |
| ProductSelection | ProductSelection |  |  |
| Group | string |  | Group. Use it to group similar campaigns. |
| PriceOutput | enum(0, 1) |  | Price output type. 0 = Campaign 1 = Sale |

### CampaignListItem

| Field | Type | Required | Description |
|---|---|---|---|
| CampaignId | string (uuid) |  |  |
| Type | string |  |  |
| CampaignBaseType | string |  |  |
| Market | string |  |  |
| StartDate | string (date-time) |  |  |
| CreateDate | string (date-time) |  |  |
| Status | string |  |  |
| Title | string |  |  |
| PromoCode | string |  |  |
| Description | string |  |  |
| Priority | integer (int32) |  |  |

### CampaignTypeItem

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| Name | string |  |  |

### ExtendedLocalizedItem

Represents an extended localized item with additional values.

| Field | Type | Required | Description |
|---|---|---|---|
| Values | string[] |  | Additional values for the extended localized item. |
| Language | string |  | The language of the localized item. |
| Value | string |  | The value of the localized item. |

### CampaignLandingPageMeta

Represents the meta information for a campaign landing page.

| Field | Type | Required | Description |
|---|---|---|---|
| Title | LocalizedItem[] |  | Localized titles for the meta information. |
| Keywords | LocalizedItem[] |  | Localized keywords for the meta information. |
| Description | LocalizedItem[] |  | Localized descriptions for the meta information. |

### ProductSelectionData

Represents the data for product selection criteria.

| Field | Type | Required | Description |
|---|---|---|---|
| Condition | enum(0, 1) |  | Condition for combining criteria. 0 = and. Logical AND condition. 1 = or. Logical OR condition. |
| Categories | ItemSelection[] |  | List of category selections. |
| Brands | ItemSelection[] |  | List of brand selections. |
| Products | integer (int32)[] |  | List of product IDs. |
| Price | PriceSelection[] |  | List of price selections. |

### ItemSelection

Represents an item selection with an ID and name.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Item ID. |
| Name | string |  | Item name. |

### PriceSelection

Represents a price selection with a condition and price values.

| Field | Type | Required | Description |
|---|---|---|---|
| Condition | enum(0, 1, 2) |  | Condition for the price selection. 0 = lt. Less than condition. 1 = gt. Greater than condition. 2 = eq. Equal to condition. |
| Prices | object |  | Dictionary of prices. Currency ISO code is used for the key. |

