# Shipping

Generated on 2026-10-04 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `--path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Shipping/ParcelGroup` | Create parcel group |
| PUT | `Shipping/ParcelGroup/{parcelGroupId}/Capture` | Capture parcel group |
| PUT | `Shipping/ParcelGroup/{parcelGroupId}/Deliver` | Deliver parcel group |
| POST | `Shipping/ParcelGroup/Query` | Query parcel groups |
| POST | `Shipping/Query` | Query shipping options |

## POST Shipping/ParcelGroup

Creates a new parcel group.

Body: `Shipping.Models.ParcelGroupOptions`

Returns: `Envelope-Int`

## PUT Shipping/ParcelGroup/{parcelGroupId}/Capture

Creates captures for a parcel group and signals capture events for them.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| parcelGroupId | path | integer (int32) | yes | The id of the parcel group to capture. |

Returns: `BaseEnvelope`

## PUT Shipping/ParcelGroup/{parcelGroupId}/Deliver

Marks a parcel group as delivered. Does not signal capture events.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| parcelGroupId | path | integer (int32) | yes | The id of the parcel group to deliver. |
| sendDeliveryEmail | query | boolean |  | Set to true to also send delivery email. |

Returns: `BaseEnvelope`

## POST Shipping/ParcelGroup/Query

Queries parcel groups.

Body: `Shipping.Models.ParcelGroupQuery`

Returns: `Envelope-List-Shipping.Models.Read.ParcelGroup`

## POST Shipping/Query

Body: `Shipping.Models.ShippingQuery`

Returns: `Shipping.Models.ShippingOption[]`

## Schemas

### Shipping.Models.ParcelGroupOptions

Creation options for new parcel groups.

| Field | Type | Required | Description |
|---|---|---|---|
| OrderIds | integer (int32)[] |  | The order ids contained in this parcel group. Required. |
| OrderRowIds | integer (int32)[] |  | Limits which order rows are included for each order defined in OrderIds. Use this to create partial deliveries. If any order rows are defined for a given order then only those order rows will be used, eg a partial delivery. If no order rows are defined for a given order then all remaining undelivered order rows will be implied. Optional. |
| MarkAsDelivered | boolean |  | Set to true to automatically mark orders as delivered upon creation of the parcel group. Defaults to false. Optional. |
| SendDeliveryEmail | boolean |  | Set to true to automatically send delivery email upon creation of the parcel group. Requires that MarkAsDelivered is also set to true. Defaults to false. Optional. |
| SignalCapturesCreated | boolean |  | Set to true to create captures and automatically signal capture events upon creation of the parcel group. Defaults to false. Optional. |
| Force | boolean |  | Set to true to force creation of the parcel group even when the listed orders have no ungrouped parcels (for example when the order rows are marked as backorder). A new parcel is created for each forced order, covering the supplied {Carismar.MgmtAPI.Features.Shipping.Models.ParcelGroupOptions.OrderRowIds} for that order, or all rows of the order when no row ids are supplied for it. Defaults to false. Optional. |

### Envelope-Int

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | integer (int32) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Shipping.Models.ParcelGroupQuery

A query to filter parcel groups by.

| Field | Type | Required | Description |
|---|---|---|---|
| ParcelGroupIds | integer (int32)[] |  | A list of parcel group ids. |
| OrderIds | integer (int32)[] |  | A list of order ids. |

### Envelope-List-Shipping.Models.Read.ParcelGroup

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Shipping.Models.Read.ParcelGroup[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Shipping.Models.ShippingQuery

A query to filter shipping options by.

| Field | Type | Required | Description |
|---|---|---|---|
| SiteId | integer (int32) |  | The site id the delivery options belong to. Required. |
| CountryId | integer (int32) |  | The country id where the order should be shipped to. |
| ShippingId | integer (int32) |  | Geins shipping option id. |
| DeliveryOptionId | string (uuid) |  | nShift delivery option id. |
| Order | Order.CheckoutOrder |  |  |
| MinimumFreeShippingLimit | number (double) |  | The cart sum limit for free shipping. Used for conditions in the delivery checkout portal. |

### Shipping.Models.ShippingOption

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| ExternalId | string |  |  |
| Name | string |  |  |
| Fee | number (double) |  |  |
| Logo | string |  |  |
| ShippingData | string |  |  |
| Options | Shipping.Models.ShippingSubOption[] |  |  |

### Shipping.Models.Read.ParcelGroup

| Field | Type | Required | Description |
|---|---|---|---|
| ParcelGroupId | integer (int32) |  |  |
| CreatedDate | string (date-time) |  |  |
| DeliveredDate | string (date-time) |  |  |
| Parcels | Shipping.Models.Read.Parcel[] |  |  |

### Order.CheckoutOrder

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | string |  |  |
| ExternalOrderId | string |  |  |
| CartId | string |  |  |
| SessionId | string |  |  |
| SiteId | integer (int32) |  |  |
| Currency | string |  |  |
| Status | string |  |  |
| IpAddress | string |  |  |
| Message | string |  |  |
| InternalMessage | string |  |  |
| Locale | string |  |  |
| Rows | Order.CheckoutOrderRow[] |  |  |
| CheckoutUrls | Order.CheckoutUrls |  |  |
| CampaignId | integer (int32) |  |  |
| CampaignCode | string |  |  |
| CampaignName | string |  |  |
| CampaignIds | string[] |  |  |
| CampaignNames | string[] |  |  |
| CustomerId | integer (int32) |  |  |
| CustomerTypeId | integer (int32) |  |  |
| Gender | enum(0, 1, 2) |  | 0 = Unknown 1 = Female 2 = Male |
| DateOfBirth | string (date-time) |  |  |
| PersonalId | string |  |  |
| UserAgent | string |  |  |
| MetaData | object |  |  |
| MemberId | integer (int32) |  |  |
| PaymentId | integer (int32) |  |  |
| TransactionId | string |  |  |
| SecondaryTransactionId | string |  |  |
| Country | string |  |  |
| Company | string |  |  |
| OrganizationNumber | string |  |  |
| FirstName | string |  |  |
| LastName | string |  |  |
| Email | string |  |  |
| Address1 | string |  |  |
| Address2 | string |  |  |
| Zip | string |  |  |
| City | string |  |  |
| Region | string |  |  |
| Phone | string |  |  |
| MobilePhone | string |  |  |
| CareOf | string |  |  |
| ShippingId | integer (int32) |  |  |
| ShippingCountry | string |  |  |
| ShippingCompany | string |  |  |
| ShippingOrganizationNumber | string |  |  |
| ShippingFirstName | string |  |  |
| ShippingLastName | string |  |  |
| ShippingEmail | string |  |  |
| ShippingAddress1 | string |  |  |
| ShippingAddress2 | string |  |  |
| ShippingZip | string |  |  |
| ShippingCity | string |  |  |
| ShippingRegion | string |  |  |
| ShippingPhone | string |  |  |
| ShippingMobilePhone | string |  |  |
| ShippingCareOf | string |  |  |
| PickupPoint | string |  |  |
| DesiredDeliveryDate | string (date-time) |  |  |
| FreightClass | Order.FreightClass |  |  |
| FreeShippingLimit | number (double) |  |  |
| FreeShippingFromLimit | boolean |  |  |
| FreeShippingFromCampaign | boolean |  |  |
| Sum | number (double) |  |  |
| ExpectedSum | number (double) |  |  |
| OrderValueIncVat | number (double) |  |  |
| OrderValueExVat | number (double) |  |  |
| ItemValueIncVat | number (double) |  |  |
| ItemValueExVat | number (double) |  |  |
| DiscountIncVat | number (double) |  |  |
| DiscountExVat | number (double) |  |  |
| PercentDiscount | integer (int32) |  |  |
| Balance | number (double) |  |  |
| ShippingFeeIncVat | number (double) |  |  |
| ShippingFeeExVat | number (double) |  |  |
| PaymentFeeIncVat | number (double) |  |  |
| PaymentFeeExVat | number (double) |  |  |

### Shipping.Models.ShippingSubOption

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| ExternalId | string |  |  |
| Name | string |  |  |
| Fee | number (double) |  |  |
| Logo | string |  |  |
| ShippingData | string |  |  |

### Shipping.Models.Read.Parcel

| Field | Type | Required | Description |
|---|---|---|---|
| ParcelGroupId | integer (int32) |  |  |
| ParcelId | integer (int32) |  |  |
| OrderId | integer (int32) |  |  |
| OrderRowIds | integer (int32)[] |  |  |
| CreatedDate | string (date-time) |  |  |

### Order.CheckoutOrderRow

| Field | Type | Required | Description |
|---|---|---|---|
| Sku | string |  |  |
| ProductId | integer (int32) |  |  |
| ExternalId | string |  |  |
| DiscountRate | number (double) |  |  |
| CartRowId | integer (int32) |  |  |
| ProductContainerBuildId | integer (int32) |  |  |
| Message | string |  |  |
| ArticleNumber | string |  |  |
| Gtin | string |  |  |
| Brand | string |  |  |
| Categories | string[] |  |  |
| Name | string |  |  |
| Variant | string |  |  |
| Quantity | integer (int32) |  |  |
| PriceIncVat | number (double) |  |  |
| PriceExVat | number (double) |  |  |
| ExpectedTotalPriceIncVat | number (double) |  |  |
| DiscountIncVat | number (double) |  |  |
| DiscountExVat | number (double) |  |  |
| ExpectedTotalDiscountIncVat | number (double) |  |  |
| ProductUrl | string |  |  |
| ImageUrl | string |  |  |
| Weight | integer (int32) |  |  |
| Height | integer (int32) |  |  |
| Width | integer (int32) |  |  |
| Length | integer (int32) |  |  |
| CampaignIds | string[] |  |  |
| CampaignGroupData | string |  |  |
| CampaignNames | string[] |  |  |
| ProductPriceCampaignId | integer (int32) |  |  |
| ProductPriceListId | integer (int32) |  |  |
| ProductPackageId | integer (int32) |  |  |
| ProductPackageName | string |  |  |
| ProductPackageGroupId | string (uuid) |  |  |

### Order.CheckoutUrls

| Field | Type | Required | Description |
|---|---|---|---|
| Redirect | string |  |  |
| Checkout | string |  |  |
| Terms | string |  |  |

### Order.FreightClass

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| Type | integer (int32) |  |  |
| Name | string |  |  |
| TypeAsEnum | enum(0, 1, 2) |  | 0 = Normal 1 = All 2 = Any |

