# Return

Generated on 2026-10-04 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `--path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Order/{orderId}/Return` | Create return |
| GET | `Order/{orderId}/Return/{returnId}` | Get return |
| GET | `Order/{orderId}/Return/List` | List returns |
| GET | `ReturnCode/List` | List return codes |

## POST Order/{orderId}/Return

Creates a new return.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The Order ID. |

Body: `Order.Return.Models.Write.NewReturn`

Returns: `Envelope-Nullable-Int`

## GET Order/{orderId}/Return/{returnId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| returnId | path | integer (int32) | yes | The return id. |

Returns: `Envelope-Return`

## GET Order/{orderId}/Return/List

Get all returns on an order.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |

Returns: `Envelope-List-Return`

## GET ReturnCode/List

Gets all valid return codes.

Returns: `Envelope-List-ReturnCode`

## Schemas

### Order.Return.Models.Write.NewReturn

| Field | Type | Required | Description |
|---|---|---|---|
| ShippingFeeRefund | number (double) |  | How much of the shipping fee to refund. Optional. |
| PaymentFeeRefund | number (double) |  | How much of the payment fee to refund. Optional. |
| ReturnFee | number (double) |  | The fee that the customer pays for the return. This value will be deducted from the total refund. Optional. |
| AdminUserId | integer (int32) |  | The id of the admin user that created the return. Leave blank if unsure. Optional. |
| Author | string |  | The name of person or system that created the return. Optional. |
| Reference | string |  | An custom reference for the return. Optional. |
| Description | string |  | A describing text for the return. Optional. |
| SkipReturnEvents | boolean |  | If set to true, no return events will be sent. |
| SkipProductEvents | boolean |  | If set to true, no product events will be sent for restocked products. |
| SkipRefundEvents | boolean |  | If set to true, no refund events will be sent. |
| RefundsRequireApproval | boolean |  | If set to true, refunds will require approval before being sent. |
| ReturnRows | NewReturnRow[] |  | The list of return rows to create. Each return row represents an order row that is returned. Required. |
| Settled | boolean |  | If true, the refund will be marked as settled immediatley and won't trigger a refund event. This can be useful if the refund needs to be created retroactively, or when the money transacation has already occured. |

### Envelope-Nullable-Int

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | integer (int32) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Return

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Return |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-Return

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Return[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-ReturnCode

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ReturnCode[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### NewReturnRow

Contains all information needed for a new return row when creating a new return.

| Field | Type | Required | Description |
|---|---|---|---|
| OrderRowId | integer (int32) |  | The order row that this return row represents. Required. |
| ReturnCode | integer (int32) |  | The return code for this return row. The return code is used to tag the return row with a reason. Required. |
| ReturnAction | enum(1, 2, 3, 4) |  | The return action for this return row. The return action decides what type of refund should be created. Required. 1 = Investigate. The return row is refunded, but is marked for investigation. 2 = NoRefund. No refund is made for the return row. 3 = RegularRefund. The return row is refunded normally. 4 = RefundToBalance. The return row is refunded to the customer's balance. 1 = Investigate. The return row is refunded, but is marked for investigation. 2 = NoRefund. No refund is made for the return row. 3 = RegularRefund. The return row is refunded normally. 4 = RefundToBalance. The return row is refunded to the customer's balance. |
| RefundAmount | number (double) |  | The refund amount for this return row. The refund amount must be less than or equal to the order row value. Required. |
| Restock | boolean |  | Set to true if the product corresponding to this return row should be automatically restocked when the return is created. |

### Return

A return.

| Field | Type | Required | Description |
|---|---|---|---|
| ReturnId | integer (int32) |  |  |
| OrderId | integer (int32) |  |  |
| CreatedOn | string (date-time) |  | The date the return was created. |
| ReturnRows | ReturnRow[] |  | List of return rows belonging to this return. |
| OrderRows | Refund.Core.Models.Order.OrderRow[] |  | List of order rows belonging to this return. |

### ReturnCode

A code used to identify the reason for a return and suggested default behaviour.

| Field | Type | Required | Description |
|---|---|---|---|
| Code | integer (int32) |  | The numerical code for the return code. |
| Name | string |  | The name of the return code. |
| AddToStock | boolean |  | If true, any return using this code is suggested to restock the product. This is just used to suggest default behaviour - the actual choice is entirely up to the author of the return. |
| DefaultReturnAction | integer (int32) |  | The default return action for this return code. This is used to determine what type of refund should be created when a return is created using this return code. This is just used to suggest default behaviour - the actual choice is entirely up to the author of the return. |

### ReturnRow

A return row.

| Field | Type | Required | Description |
|---|---|---|---|
| ReturnId | integer (int32) |  | The return id that this return row belongs to. |
| ReturnRowId | integer (int32) |  | The id of this return row. |
| OrderRowId | integer (int32) |  | The order row is that this return row belongs to. |
| ReturnCode | integer (int32) |  | The return code for this return row. |
| ReturnAction | enum(1, 2, 3, 4) |  | The action taken for this return row. 1 = Investigate. The return row is refunded, but is marked for investigation. 2 = NoRefund. No refund is made for the return row. 3 = RegularRefund. The return row is refunded normally. 4 = RefundToBalance. The return row is refunded to the customer's balance. 1 = Investigate. The return row is refunded, but is marked for investigation. 2 = NoRefund. No refund is made for the return row. 3 = RegularRefund. The return row is refunded normally. 4 = RefundToBalance. The return row is refunded to the customer's balance. |

### Refund.Core.Models.Order.OrderRow

An order row.

| Field | Type | Required | Description |
|---|---|---|---|
| OrderRowId | integer (int32) |  | The id of the order row. |
| ItemId | integer (int32) |  | The SKU. |
| ProductId | integer (int32) |  | The product id. |
| Price | number (double) |  | The price of the order row, inc vat. |
| PriceExVat | number (double) |  | The price of the order row, ex vat. |
| Name | string |  | The name of the order row. |
| ProductName | string |  | The name of the product. |
| Variant | string |  | The name of the variant. |
| Brand | string |  | The name of the product brand. |
| PrimaryImage | string |  | The primary image of the product. |
| ArticleNumber | string |  | The article number. |
| Shelf | string |  | The shelf of the SKU. |
| CampaignNames | string |  | The name of the campaigns applied to this order row. |
| Discount | number (double) |  | The discount amount applied to this order row. |
| SuggestedRefundAmount | number (double) |  | A suggested refund amount if this order row were to be returned. This takes into account discounts applied to the entire order. |
| AverageDiscount | number (double) |  | The average discount applied to this order row. This takes into account discounts applied to the entire order. |
| PriceBeforeDiscount | number (double) |  | The price of the order row before any discounts were applied. |

