# Order

Generated on 2026-10-04 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `--path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Order` | Create order |
| DELETE | `Order/{id}` | Delete order |
| PATCH | `Order/{id}` | Partial update of an order |
| GET | `Order/{id}/{include}` | Get order (id) |
| POST | `Order/{id}/Comment` | Add order comment |
| POST | `Order/{id}/Status/{status}/{transactionId}/{secondaryTransactionId}` | Update order status |
| POST | `Order/{id}/TransactionData` | Update transaction data |
| DELETE | `Order/{orderId}/OrderRow/{orderRowId}` | Cancel order row |
| GET | `Order/ByExternalId/{externalId}/{include}` | Get order (external id) |
| GET | `Order/ByPublicId/{publicId}/{include}` | Get order (public id) |
| GET | `Order/Capture/{captureId}` | Get capture |
| POST | `Order/Capture/SetAsProcessed` | Set capture as processed |
| GET | `Order/Count/{email}` | Count orders |
| POST | `Order/Id` | Create order id |
| POST | `Order/PaymentDetail/{paymentDetailId}/SetAsPaid` | Set payment as paid |
| POST | `Order/PublicId/{publicId}` | Create or reserve public order id |
| POST | `Order/Query` | Query orders |
| POST | `Order/Query/{page}` | Query orders (Paged) |
| GET | `Order/Statuses` | Get order statuses |
| POST | `Order/ValidateCreation` | Validate order |

## Pitfalls

Behaviour the spec does not state. Read before writing to this resource. Items marked *(unverified)* were reported from another client and have not been reproduced against a live account; trust them less, and read back to check.

- **If `Order/Query` answers 500 `A database error occured.`, add a `StatusList`.** Another account
  has been seen to reject queries without `StatusList` or `CustomerId`, and to reject the `inactive`
  and `pending` statuses the spec lists as valid. Labs accepts all of these, so treat this as a
  fallback when a query fails, not a rule to apply up front. *(unverified)*

## POST Order

Create a new order.

Body: `Order.Models.Order`

Returns: `Envelope-Int`

## DELETE Order/{id}

Deletes or deactivates an order.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The ID of the order to delete. |
| operation | query | enum(0, 1, 2) | yes | The method of deletion desired. 0 = OnHold. Put this order on hold. 1 = Cancel. Cancel this order permanently. 2 = Deactivate. Mark this order as no longer active. |
| skipRestock | query | boolean | yes | Set to true to prevent stock counts from being restored. Only applies to cancelled orders. Defaults to false. |

Returns: `object`

## PATCH Order/{id}

Only the properties supplied are updated; omitted properties are left unchanged. An externalId may only be held by one order. Supplying one that is already set on a different order returns 409 Conflict and leaves the order untouched.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The orderId of the order to update |

Body: `Order.Models.OrderUpdate`

Returns: `object`

## GET Order/{id}/{include}

Get order by id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The ID of the order to get. |
| include | path | string | yes | A comma separated string of related collections to include with this result set. Possible values are: paymentdetails shippingdetails refunds |
| combineProductContainerRows | query | boolean |  | If true, will combine all order rows that are part of a container into a single container row. |
| groupOrderRows | query | boolean |  | If true, will group order rows in the response. This overrides the users default setting. |
| includeRowIds | query | boolean |  | Used together with groupOrderRows to include the row IDs in the response. Default is false. |

Returns: `Order.Models.Order`

## POST Order/{id}/Comment

Adds a comment to an order. This does not replace any previous comments.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | Order ID. |

Body: `API.Order.OrderComment`

Returns: `BaseEnvelope`

## POST Order/{id}/Status/{status}/{transactionId}/{secondaryTransactionId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The order id. |
| status | path | enum(0, 1, 2, 3, 4, 5, 6, 7) | yes | The order status to set. 0 = Undefined 1 = Completed 2 = Cancelled 3 = OnHold 4 = Inactive 5 = OutOfStock 6 = Backorder 7 = Pending |
| transactionId | path | string | yes | A transaction id can be set here if status is set to pending. |
| secondaryTransactionId | path | string | yes | A secondary transaction id, if any, can be set here if status is set to pending. |

Returns: `BaseEnvelope`

## POST Order/{id}/TransactionData

Updates transaction data on an order.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | Order ID. |

Body: `API.Order.TransactionData`

Returns: `BaseEnvelope`

## DELETE Order/{orderId}/OrderRow/{orderRowId}

Cancels an order row. Can only be done on an order that has not been delivered or cancelled.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The id of the order containing the order row. |
| orderRowId | path | integer (int32) | yes | The id of the order row to cancel. |
| skipRestock | query | boolean |  | If true will not restock the item that was cancelled. Defaults to false. |

Returns: `BaseEnvelope`

## GET Order/ByExternalId/{externalId}/{include}

Get order by external id, as set by an external system. An external id identifies a single order: the partial update endpoint rejects an id that is already set on another order, and the database enforces it with a unique index. The value must be URL encoded. If it contains a forward slash, use the order query endpoint instead.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| externalId | path | string | yes | The external ID of the order to get. |
| include | path | string | yes | A comma separated string of related collections to include with this result set. Possible values are: paymentdetails shippingdetails refunds |
| combineProductContainerRows | query | boolean |  | If true, will combine all order rows that are part of a container into a single container row. |
| groupOrderRows | query | boolean |  | If true, will group order rows in the response. This overrides the users default setting. |
| includeRowIds | query | boolean |  | Used together with groupOrderRows to include the row IDs in the response. Default is false. |

Returns: `Order.Models.Order`

## GET Order/ByPublicId/{publicId}/{include}

Get order by public id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| publicId | path | string (uuid) | yes | The Public ID of the order to get. |
| include | path | string | yes | A comma separated string of related collections to include with this result set. Possible values are: paymentdetails shippingdetails refunds |
| combineProductContainerRows | query | boolean |  | If true, will combine all order rows that are part of a container into a single container row. |
| groupOrderRows | query | boolean |  | If true, will group order rows in the response. This overrides the users default setting. |
| includeRowIds | query | boolean |  | Used together with groupOrderRows to include the row IDs in the response. Default is false. |

Returns: `Order.Models.Order`

## GET Order/Capture/{captureId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| captureId | path | string (uuid) | yes | Capture ID. |

Returns: `Envelope-Order.Capture`

## POST Order/Capture/SetAsProcessed

Sets a capture as processed (= captured).

Body: `Order.ProcessedCapture`

Returns: `BaseEnvelope`

## GET Order/Count/{email}

Gets the number of orders placed with the supplied email address.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| email | path | string | yes | The email adress to aggregate on. |

Returns: `integer (int32)`

## POST Order/Id

Create a new order id.

Returns: `Envelope-Int`

## POST Order/PaymentDetail/{paymentDetailId}/SetAsPaid

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| paymentDetailId | path | integer (int32) | yes | Payment Detail ID. |

Returns: `BaseEnvelope`

## POST Order/PublicId/{publicId}

Creates or reserves a new order public id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| publicId | path | string (uuid) | yes | If not provided, a new public id will be generated. |

Returns: `Envelope-Order.Models.OrderIdData`

## POST Order/Query

Queries orders. Observe that this method is not paged and will only return maximum 10000 orders. For larger result sets, use the paged version of this method.

Body: `Order.Models.OrderQuery`

Returns: `Order.Models.Order[]`

## POST Order/Query/{page}

The default page size is 1000. Paging is optimized for performance but may exhibit non-deterministic behavior—items can be duplicated or skipped across pages if the underlying data changes between requests. When fetching page 2 or higher, a BatchId must be included in the query object. This BatchId is provided in the response from page 1. Once a BatchId is supplied, the original order query filters are automatically reused, so it is not necessary to include them again.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | The page to fetch. To start a new batched query it is mandatory to send in page=1. |

Body: `Order.Models.OrderQuery`

Returns: `PagedEnvelope-List-Order.Models.Order`

## GET Order/Statuses

Get a list of available order statuses.

Returns: `Order.Models.OrderStatus[]`

## POST Order/ValidateCreation

Validates order data for order creation.

Body: `Order.ValidateOrderCreationRequest`

Returns: `Envelope-API.Order.OrderCreationValidationStatus`

## Schemas

### Order.Models.Order

An order.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | The id of the order. |
| ChannelId | string |  | Channel id. Format: {Íd}\|{MarketTopDomain}, Read only. |
| ExternalId | string |  | The external id of the order. |
| PersonalId | string |  | The personal id or organisation number of the customer. |
| CustomerId | integer (int32) |  | The id of the customer that placed the order. |
| CustomerEmail | string |  | The email of the customer that placed the order. |
| CustomerTypeId | integer (int32) |  | Customer type. Usually 1 for private customers and 2 for companies. |
| CustomerGroupId | integer (int32) |  | The id of the customer group that the customer belongs to, if any. |
| CustomerGroupName | string |  | The name of the customer group that the customer belongs to, if any. |
| CustomerLoggedIn | boolean |  | Indicates if the order was placed with a logged in customer. Will default to true if order is created with a CustomerId. |
| CreatedAt | string (date-time) |  | Date and time when the order was created. |
| UpdatedAt | string (date-time) |  | Date and time when the order was last updated. |
| CompletedAt | string (date-time) |  | The date nd time when the order was completed (eg delivered and paid). |
| Status | string |  | The order status. Possbile values: cancelled on-hold inactive refunded partial pending-payment backorder completed pending |
| Currency | string |  | ISO currency code. |
| CurrencyRate | number (double) |  | The currency rate to SEK. |
| MarketId | integer (int32) |  | The id of the market that this order originates from. |
| MarketName | string |  | The market name. This is usually equal to the site or channel name. |
| Language | string |  | Two-letter language code. |
| OrderTotal | number (double) |  | Order total. |
| ExpectedSum | number (double) |  | Expected total sum to be paid after discount and balance. The value is usually taken directly from the payment provider and represents the actual reserved amount. If this differs from OrderTotal, actions should be taken to ensure they match. This usually happens due to rounding. |
| VATTotal | number (double) |  | Order VAT total. |
| OrderValueIncVat | number (double) |  | Order value inc vat after discount but before balance. |
| OrderValueExVat | number (double) |  | Order value ex vat after discount but before balance. |
| ItemValueIncVat | number (double) |  | Item value inc vat excluding fees and discount. |
| ItemValueExVat | number (double) |  | Item value ex vat excluding fees and discount. |
| Discount | number (double) |  | Total discount inc vat. |
| DiscountExVat | number (double) |  | Total discount ex vat. |
| FromBalance | number (double) |  | The amount which was withdrawn from the customers balance inc vat. |
| ShippingFee | number (double) |  | Shipping fee inc vat. |
| ShippingFeeExVat | number (double) |  | Shipping fee ex vat. |
| PaymentFee | number (double) |  | Payment fee inc vat. |
| PaymentFeeExVat | number (double) |  | Payment fee ex vat. |
| Message | string |  | Order message. Can contain instructions from customer or added details about the order. |
| OrderMessages | string[] |  | Internal order messages. Can contain internal details about the order. |
| PaymentDetails | Order.Models.PaymentDetail[] |  | List of payment details. |
| ShippingDetails | Order.Models.ShippingDetail[] |  | List of shipping details. |
| ShippingAddress | Order.Models.Address |  |  |
| BillingAddress | Order.Models.Address |  |  |
| Rows | Order.Models.OrderRow[] |  | List of order rows. |
| Refunds | Order.Models.OrderRefund[] |  | List of order refunds. |
| Ip | string |  | Customer IP-number. |
| UserAgent | string |  | Customer User Agent. |
| ServiceLocation | string |  | Chosen service location. |
| CampaignCode | string |  | Campaign code applied to the order. |
| CampaignCodeId | integer (int32) |  | The internal id of the applied campaign code. |
| Percent | integer (int32) |  | General percent discount applied to the order. |
| DesiredDeliveryDate | string (date-time) |  | The desired delivery date of the order. |
| Gender | boolean |  | The gender of the customer. True = male, False = female, null = unknown. |
| CartId | integer (int32) |  | The id of the cart from which this order originates. |
| SessionId | string |  | The session id for the from which this order originates. |
| ExternalOrderStatus | enum(0, 10, 20, 30, 40) |  | 0 = None 10 = New 20 = Processing 30 = Failed 40 = Done |
| CampaignIds | string[] |  | The ids for the campaigns applied to this order (not rows). |
| CampaignNames | string[] |  | The names of the campaigns applied to this order (not rows). |
| MetaData | object |  | The order meta data to store additional information about the order. |
| PublicId | string (uuid) |  | The public id of this order. |
| GoodsLabel | string |  | An optional text usually used to mark the goods. The value may be included on the shipment so it can be printed on packaging, labels, or other markings that follow the goods. |
| CustomerOrderNumber | string |  | An optional customer-supplied reference number for the order. Use this field to include your own internal order number, PO number, or tracking identifier. The value is not validated or required to be unique. |

### Envelope-Int

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | integer (int32) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.Models.OrderUpdate

An update operation on an order.

| Field | Type | Required | Description |
|---|---|---|---|
| ExternalId | string |  | The external id for the order. |
| ParcelNumber | string |  | Parcel number (tracking number). |
| ExternalOrderStatus | enum(0, 10, 20, 30, 40) |  | The external order status. 0 = None 10 = New 20 = Processing 30 = Failed 40 = Done |
| ReturnParcelNumber | string |  | Parcel number (tracking number) for a return shipment. |
| GoodsLabel | string |  | An optional text usually used to mark the goods. The value may be included on the shipment so it can be printed on packaging, labels, or other markings that follow the goods. |
| CustomerOrderNumber | string |  | An optional customer-supplied reference number for the order. Use this field to include your own internal order number, PO number, or tracking identifier. The value is not validated or required to be unique. |

### API.Order.OrderComment

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | integer (int32) |  |  |
| Comment | string |  |  |
| System | boolean |  |  |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### API.Order.TransactionData

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | integer (int32) |  |  |
| TransactionId | string |  |  |

### Envelope-Order.Capture

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Order.Capture |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.ProcessedCapture

| Field | Type | Required | Description |
|---|---|---|---|
| CaptureId | string (uuid) |  |  |
| ExternalId | string |  |  |
| Reference | string |  |  |
| ProcessedOn | string (date-time) |  |  |

### Envelope-Order.Models.OrderIdData

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Order.Models.OrderIdData |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.Models.OrderQuery

An order query.

| Field | Type | Required | Description |
|---|---|---|---|
| Updated | string (date-time) |  | Given a date, only orders updated after the provided date will be returned. Deprecated, use UpdatedAfter instead. |
| UpdatedAfter | string (date-time) |  | Given a date, only orders updated after the provided date will be returned. |
| UpdatedBefore | string (date-time) |  | Given a date, only orders updated before the provided date will be returned. |
| CreatedBefore | string (date-time) |  | Given a date, only orders created before the provided date will be returned. |
| CreatedAfter | string (date-time) |  | Given a date, only orders created after the provided date will be returned. |
| CompletedBefore | string (date-time) |  | Given a date, only orders completed before the provided date will be returned. |
| CompletedAfter | string (date-time) |  | Given a date, only orders completed after the provided date will be returned. |
| StatusList | string |  | Comma separated list of statuses to filter on. Valid statuses are: cancelled on-hold inactive refunded partial backorder completed pending |
| MarketId | integer (int32) |  | Id of a market. |
| PaymentName | string |  | Name of a payment method. |
| ParcelGroupId | integer (int32) |  | Id of a parcel group. |
| CustomerId | integer (int32) |  | The id of a customer. |
| CustomerGroupId | integer (int32) |  | The customer group id (member id) of the customer. |
| Email | string |  | The email of a customer. |
| ExternalId | string |  | The external id of an order, as set by an external system. Exact match. |
| Include | string |  | Comma separated list of child-collections to also include in the query result. Possible values are: paymentdetails shippingdetails refunds |
| ExternalOrderStatus | integer (int32) |  | This status can be used by an external system to change the status of an order, such as failed or done. Predefined statuses are: 0 = None 10 = New 20 = Processing 30 = Failed 40 = Done |
| CombineProductContainerRows | boolean |  | If true, will combine all order rows that are part of a container into a single container row. |
| PackingLocationId | integer (int32) |  | The packing place to get orders from. |
| GroupOrderRows | boolean |  | Used to group order rows in order responses. This overrides the users default setting. |
| IncludeRowIds | boolean |  | Used together with GroupOrderRows to include the row IDs in the response. Default is false. |
| BatchId | string (uuid) |  | Used to fetch orders where the result set is split into batches. |

### PagedEnvelope-List-Order.Models.Order

| Field | Type | Required | Description |
|---|---|---|---|
| PageResult | PageResult |  |  |
| Resource | Order.Models.Order[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.Models.OrderStatus

An order status.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | Status name. |
| DisplayName | string |  | Status display name. |

### Order.ValidateOrderCreationRequest

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | integer (int32) |  |  |
| UserId | integer (int32) |  |  |
| Email | string |  |  |
| Phone | string |  |  |
| Currency | string |  |  |
| SumIncVat | number (double) |  |  |
| BalanceIncVat | number (double) |  |  |
| Items | Order.ValidateOrderCreationRequest.StockItem[] |  |  |

### Envelope-API.Order.OrderCreationValidationStatus

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | API.Order.OrderCreationValidationStatus |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.Models.PaymentDetail

Payment details for an order.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Unique identifier for this payment detail. Exception: For some payment options this field can be 0. These orders only have one payment detail. |
| PaymentId | integer (int32) |  | Payment method id. |
| Name | string |  | The name of the payment method. |
| DisplayName | string |  | The display name of the payment method. |
| TransactionId | string |  | The transaction id (external reference). |
| SecondaryTransactionId | string |  | The secondary transaction id, if any (external reference). |
| ReservationNumber | string |  | The reservation number. This field is not available for all payment methods. |
| ReservationDate | string (date-time) |  | Reservation date. |
| PaymentDate | string (date-time) |  | The date all captures have been processed. |
| Total | number (double) |  | Total. |
| Payed | boolean |  | True if all captures have been processed. |
| PaymentFee | number (double) |  | The payment fee. |
| ShippingFee | number (double) |  | The shipping fee. |
| PaymentOption | string |  | The name of the payment option, if any. This doesn't have to be the same as the payment name. Eg "Direct bank payment", "Card", "Invoice" etc. |

### Order.Models.ShippingDetail

Shipping details for an order.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | The id of the shipping detail. |
| ShippingId | integer (int32) |  | Id of the shipping method. |
| Name | string |  | Name of the shipping method. |
| ParcelNumber | string |  | Parcel number (tracking number). |
| ShippingDate | string (date-time) |  | Shipping date. |
| TrackingUrl | string |  | Tracking URL. |
| ExternalDeliveryOptionId | string |  | Delivery option id of the external shipping provider. |
| ExternalServiceId | string |  | Service id of the external shipping provider. |
| ExternalCarrierId | string |  | Carrier id of the external shipping provider. |
| ExternalDeliveryId | string |  | Delivery id of the external shipping provider. |
| PickupPoint | string |  | Pickup point. |
| ExternalDeliveryData | string |  | External delivery data. Usually a JSON string. Example for nShift: {"agent":{"quickId":"GV004","name":"Gävle ICA Söder","address1":"Södra Kungsgatan 32","address2":null,"zipcode":"80252","city":"Gävle","country":"SE"},"service":{"id":"BUDBEEBOX","name":"Budbee Box","title":"Budbee Box","sourceSystem":"UNIFAUNONLINE"},"senderPartner":{"id":"BUDBEE","agentNo":null,"custNo":"000000","bookingId":"000000"},"prepareId":"00000000000000000000000000000000"} |

### Order.Models.Address

An address.

| Field | Type | Required | Description |
|---|---|---|---|
| Company | string |  | Company name. |
| CareOf | string |  | Care of. C/O. |
| State | string |  | ISO code or name of the state, province or district. |
| Country | string |  | ISO code of the country. |
| FirstName | string |  | The first part(s) of the customer name. |
| LastName | string |  | The last part(s), or family name of the customer. |
| Email | string |  | The email of the customer. |
| AddressLine1 | string |  | The first line of the address, usually street and house number. |
| AddressLine2 | string |  | The second line of the address. |
| AddressLine3 | string |  | The third line of the address. |
| Zip | string |  | The postal / zip code. |
| City | string |  | The city. |
| Phone | string |  | The (land-line) phone number of the customer. |
| Mobile | string |  | The SMS-capable number of the customer. |
| EntryCode | string |  | The delivery address entry code, if needed for successful delivery. |

### Order.Models.OrderRow

An order row.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | The id of this order row. If the order row has been grouped with other rows, this is the id of the first row in the group. |
| IdList | string |  | If this order row has been grouped with other rows, this contains a comma separated list of the ids of the original rows. |
| ProductId | integer (int32) |  | Product id. |
| Name | string |  | Order row name. |
| ProductName | string |  | Product name. |
| ItemId | integer (int32) |  | Item id (SKU). |
| ItemName | string |  | Item name. |
| ArticleNumber | string |  | Article number. |
| Total | number (double) |  | Order row total (affected by quantity). |
| ExpectedTotalPriceIncVat | number (double) |  | Expected total price inc vat, inc row discount. The value is usually taken directly from the payment provider and represents the actual paid amount. |
| DiscountRate | number (double) |  | Order row discount rate. E.g. 10% = 10.0 |
| Discount | number (double) |  | Order row discount sum inc VAT. |
| ExpectedTotalDiscountIncVat | number (double) |  | Expected total discount inc vat. The value is usually taken directly from the payment provider and represents the actual applied discount amount. |
| VATTotal | number (double) |  | Order row total VAT (affected by quantity). |
| VATRate | number (double) |  | VAT rate. E.g. 25% = 0.25. |
| Quantity | integer (int32) |  | Quantity. |
| PurchasePrice | number (double) |  | Purchase price of the product. |
| PaymentDetailId | integer (int32) |  | A reference to the payment detail that this row belongs to. |
| ShippingDetailId | integer (int32) |  | A reference to the shipping detail that this row belongs to. |
| Market | string |  | The market that the order row belongs to. |
| UnitPrice | number (double) |  | Order row unit price inc vat, inc row discount. |
| ProductContainerBuildId | integer (int32) |  | A reference to the product container build the row belongs to. |
| Message | string |  | A system message for this row. |
| CartRowId | integer (int32) |  | The unique identifier for the cart row from which this order row originates. |
| ExternalId | string |  | The identifier for the external row from which this order row originates. |
| ProductContainerSelectionId | integer (int32) |  | The identifier for a Product container selection id that is part of the product configurator module |
| ProductContainerName | string |  | The name of the product container. |
| ExternalProductId | string |  | External Id of the product. |
| ExternalProductItemId | string |  | External Id of the product item. |
| ParcelGroupId | integer (int32) |  | Parcel group id for a shipped order row. |
| BrandName | string |  | Brand name of the product. |
| Gtin | string |  | The GTIN number for the product item. Also known as EAN, UCC or UPS number. |
| Weight | integer (int32) |  | The weight of the product item in grams (g). |
| Length | integer (int32) |  | The length of the product item in millimeters (mm). |
| Width | integer (int32) |  | The width of the product item in millimeters (mm). |
| Height | integer (int32) |  | The height of the product item in millimeters (mm). |
| Color | string |  | Product color. E.g. Black. |
| Variant | string |  | Product variant. E.g. Black XL. |
| CampaignIds | string[] |  |  |
| CampaignGroupData | string |  | Contains json data describing the different campaign groups belonging to this row. Fields: i -&gt; Campaign Number (int), n -&gt; Number of items belonging to this group. |
| CampaignGroupId | integer (int32) |  | Contains the the ID of the campaign group this row belongs to. |
| CampaignNames | string[] |  |  |
| CategoryId | integer (int32) |  | The product category for the product on this order row. |
| RelatedProductsBuildId | string |  | GUID that connects orderrows that are part of a build. |
| PackingLocationId | integer (int32) |  | The packing location of this order row. |
| ProductPriceCampaignId | integer (int32) |  | The id of the applied product price campaign. |
| ProductPriceListId | integer (int32) |  | The id of the applied product price list. |
| ProductPackageId | integer (int32) |  | Id of the product package used for this row. |
| ProductPackageName | string |  | Name of the product package used for this row. |
| ProductPackageGroupId | string (uuid) |  | The unique group id for the product package used for this row. This separates purchases of multiple packages with the same id. |
| Status | string |  | Status of the order row. Possible values are: ready, returned, shipped, cancelled, backorder |
| ExternalPriceSource | string |  | The external price source for this order row, if applicable. This is used to identify the source of the price, such as a third-party service or internal pricing system. |
| ConfigurationId | string |  | The id of the committed product configuration behind this row. |

### Order.Models.OrderRefund

A refund.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | The id of this refund. |
| OrderRowId | integer (int32) |  | Reference to the order row that has been refunded. |
| PaymentDetailId | integer (int32) |  | Reference to the payment detail that has been refunded. |
| ReturnId | integer (int32) |  | Id number of the return. Can be used to group refunds. |
| ArticleNumber | string |  | Article number. If the refund is not bound to an order row this field contains an optional refund article number. |
| CreatedAt | string (date-time) |  | Datetime when the refund was created. |
| Total | number (double) |  | Total amount refunded. |
| ReasonCode | integer (int32) |  | Reason code for the refund. |
| Reason | string |  | Reason for refund. |
| ToBalance | boolean |  | Shows if the refund was deposited to the customers balance. |
| Vat | number (double) |  | Vat percent in decimals for the refunded amount. |
| ItemId | integer (int32) |  | Item id (SKU). |
| RefundType | string |  | Refund type. |

### Order.Capture

| Field | Type | Required | Description |
|---|---|---|---|
| CaptureId | string (uuid) |  |  |
| OrderPaymentId | string (uuid) |  |  |
| OrderId | integer (int32) |  |  |
| ExternalOrderId | string |  |  |
| ExternalId | string |  |  |
| Reference | string |  |  |
| Description | string |  |  |
| ProcessedOn | string (date-time) |  |  |
| CapturedItemTotal | number (double) |  |  |
| CapturedShippingFee | number (double) |  |  |
| CapturedPaymentFee | number (double) |  |  |
| CapturedDiscount | number (double) |  |  |
| CapturedBalance | number (double) |  |  |
| VatRate | number (double) |  |  |
| TrackingNumber | string |  |  |
| ShippingName | string |  |  |
| TrackingUri | string |  |  |
| ShippingMethod | string |  |  |
| PaymentName | string |  |  |
| Locale | string |  |  |
| Rows | Order.CaptureRow[] |  |  |
| OrderTransactionId | string |  |  |
| SecondaryOrderTransactionId | string |  |  |

### Order.Models.OrderIdData

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | integer (int32) |  |  |
| PublicId | string (uuid) |  |  |

### PageResult

Contains pagination information for paged operations, i.e. PageSize and PageCount.

| Field | Type | Required | Description |
|---|---|---|---|
| BatchId | string (uuid) |  | The id of the batch operation. If this property has a value for the first fetched page it has to be passed as a parameter for all subsequent requests. |
| Page | integer (int32) |  | The current page |
| RowCount | integer (int32) |  | Total number of rows |
| PageCount | integer (int32) |  | Total number of pages |
| PageSize | integer (int32) |  | Page size |
| HasMoreRows | boolean |  | True if there is more content to fetch. |

### Order.ValidateOrderCreationRequest.StockItem

| Field | Type | Required | Description |
|---|---|---|---|
| ItemId | integer (int32) |  |  |
| Quantity | integer (int32) |  |  |

### API.Order.OrderCreationValidationStatus

| Field | Type | Required | Description |
|---|---|---|---|
| Success | boolean |  |  |
| Message | string |  |  |

### Order.CaptureRow

| Field | Type | Required | Description |
|---|---|---|---|
| OrderRowId | integer (int32) |  |  |
| ItemId | integer (int32) |  |  |
| ProductId | integer (int32) |  |  |
| Price | number (double) |  |  |
| PriceExVat | number (double) |  |  |
| Name | string |  |  |
| ProductName | string |  |  |
| Variant | string |  |  |
| Brand | string |  |  |

