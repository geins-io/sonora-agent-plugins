# Refund

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Order/{orderId}/Refund` | Creates refund |
| GET | `Order/{orderId}/Refund/{refundId}` | Get refund |
| DELETE | `Order/{orderId}/Refund/{refundId}/RefundRow/{refundRowId}` | Delete refund row |
| POST | `Order/{orderId}/Refund/{refundId}/RefundRow/{refundRowId}/SetAsSettled` | Set refund row as settled |
| POST | `Order/{orderId}/Refund/{refundId}/SetApproval` | Set refund approval |
| POST | `Order/{orderId}/Refund/{refundId}/SetAsProcessed` | Set refund as processed |
| POST | `Order/{orderId}/Refund/{refundId}/SetAsSettled` | Set refund as settled |
| GET | `Order/{orderId}/Refund/List` | List refunds |
| POST | `Refund/Query` | Query refunds |

## POST Order/{orderId}/Refund

Creates a new refund.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |

Body: `Order.Refund.Models.Write.NewRefund`

Returns: `Envelope-Nullable-Guid`

## GET Order/{orderId}/Refund/{refundId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| refundId | path | string (uuid) | yes | The refund id. |

Returns: `Envelope-Refund`

## DELETE Order/{orderId}/Refund/{refundId}/RefundRow/{refundRowId}

Delete a refund row. Can only be done if the refund row isn't settled.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| refundId | path | string (uuid) | yes | The refund id. |
| refundRowId | path | integer (int32) | yes | The refund row id. |

Returns: `BaseEnvelope`

## POST Order/{orderId}/Refund/{refundId}/RefundRow/{refundRowId}/SetAsSettled

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| refundId | path | string (uuid) | yes | The refund id. |
| refundRowId | path | integer (int32) | yes | The refund row id. |

Body: `Order.Refund.Models.Write.SettledRefundRow`

Returns: `BaseEnvelope`

## POST Order/{orderId}/Refund/{refundId}/SetApproval

Approve or deny a pending refund.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The Order ID. |
| refundId | path | string (uuid) | yes | The Refund ID. |

Body: `Order.Refund.Models.Write.RefundApproval`

Returns: `BaseEnvelope`

## POST Order/{orderId}/Refund/{refundId}/SetAsProcessed

Sets a refund as processed and all refund rows within it as settled.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| refundId | path | string (uuid) | yes | The refund id. |

Body: `Order.Refund.Models.Write.ProcessedRefund`

Returns: `BaseEnvelope`

## POST Order/{orderId}/Refund/{refundId}/SetAsSettled

Sets all refund rows in a refund as settled.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The order id. |
| refundId | path | string (uuid) | yes | The refund id. |

Body: `Order.Refund.Models.Write.SettledRefund`

Returns: `BaseEnvelope`

## GET Order/{orderId}/Refund/List

Get all refunds on an order.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| orderId | path | integer (int32) | yes | The Order ID. |

Returns: `Envelope-List-Refund`

## POST Refund/Query

Queries all refunds.

Body: `RefundQuery`

Returns: `Envelope-List-Refund`

## Schemas

### Order.Refund.Models.Write.NewRefund

| Field | Type | Required | Description |
|---|---|---|---|
| OrderRowId | integer (int32) |  | The order row that this refund row represents. Commonly used with returns. Optional. |
| Reference | string |  | An custom reference for the refund. Optional. |
| Description | string |  | A description of the refund. Optional. |
| Author | string |  | The name of author of the refund. Optional. |
| RefundAmount | number (double) |  | The refund amount. Required. |
| ToBalance | boolean |  | If true, will refund the amount to the customer's balance. |
| Settled | boolean |  | If true, the refund will be marked as settled immediatley and won't trigger a refund event. This can be useful if the refund needs to be created retroactively, or when the money transacation has already occured. |
| RefundType | enum(0, 1, 2, 3) |  | What kind of source transaction the refund is derived from. 0 = Default. A regular refund of the order or order row. 1 = InstanceCost. Return cost type, used in drawing cost for instance. 2 = Shipping. Refund shipping type, used to refund shipping. 3 = InvoiceFee. Refund invoice fee. 0 = Default. A regular refund of the order or order row. 1 = InstanceCost. Return cost type, used in drawing cost for instance. 2 = Shipping. Refund shipping type, used to refund shipping. 3 = InvoiceFee. Refund invoice fee. |
| SkipRefundEvents | boolean |  | If true, will skip sending refund events. |
| RefundsRequireApproval | boolean |  | If set to true, refunds will require approval before being sent. Only applies if Settled is false. |

### Envelope-Nullable-Guid

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | string (uuid) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Refund

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Refund |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Order.Refund.Models.Write.SettledRefundRow

| Field | Type | Required | Description |
|---|---|---|---|
| SettledByAdminUserId | integer (int32) |  | The id of the admin user that settled the refund. Leave blank if unsure. Optional. |
| SettledOn | string (date-time) |  | The date the refund was settled. Defaults to now. Optional. |

### Order.Refund.Models.Write.RefundApproval

| Field | Type | Required | Description |
|---|---|---|---|
| Approved | boolean |  | The approval decision. Refund will be approved if true and denied if false. |
| ApprovalDecidedBy | string |  | The name of the user that made the approval decision. Optional. |
| ApprovalDecidedOn | string (date-time) |  | The date the approval decision was made. Defaults to now. Optional. |

### Order.Refund.Models.Write.ProcessedRefund

| Field | Type | Required | Description |
|---|---|---|---|
| ExternalId | string |  | An external id for the act of setting the refund as processed. Optional. |
| Reference | string |  | An custom reference for the act of setting the refund as processed.. Optional. |
| ProcessedOn | string (date-time) |  | The date the refund was processed. Defaults to now. Optional. |

### Order.Refund.Models.Write.SettledRefund

| Field | Type | Required | Description |
|---|---|---|---|
| SettledByAdminUserId | integer (int32) |  | The id of the admin user that settled the refund. Leave blank if unsure. Optional. |
| SettledOn | string (date-time) |  | The date the refund was settled. Defaults to now. Optional. |

### Envelope-List-Refund

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Refund[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### RefundQuery

Defines a query used to filter refunds. All properties are optional.

| Field | Type | Required | Description |
|---|---|---|---|
| CreatedAfter | string (date-time) |  | Limits refunds to those created after this date. |
| CreatedBefore | string (date-time) |  | Limits refunds to those created before this date. |
| ApprovedAfter | string (date-time) |  | Limits refunds to those approved after this date. |
| ApprovedBefore | string (date-time) |  | Limits refunds to those approved before this date. |
| UpdatedAfter | string (date-time) |  | Limits refunds to those updated after this date. |
| UpdatedBefore | string (date-time) |  | Limits refunds to those updated before this date. |
| IncludeStatuses | enum(0, 1, 2, 3, 4, 5, 6, 7)[] |  | Limits refunds to only those with any of the specified statuses. 0 = All. Include all statuses. 1 = Sent. Include refunds marked as sent. 2 = Settled. Include refunds marked as settled. 3 = SettledManually. Include refunds marked as manually settled. 4 = Processed. Include refunds marked as processed. 5 = Investigation. Include refunds marked for investigation. 6 = Pending approval. Include refunds that are pending approval. 7 = Approved. Include refunds that are approved. Defaults to All if not set. |
| ExcludeStatuses | enum(0, 1, 2, 3, 4, 5, 6, 7)[] |  | Limits refunds to only those without any of the specified statuses. 1 = Sent. Exclude refunds marked as sent. 2 = Settled. Exclude refunds marked as settled. 3 = SettledManually. Exclude refunds marked as manually settled. 4 = Processed. Exclude refunds marked as processed. 5 = Investigation. Exclude refunds marked for investigation. 6 = Pending approval. Exclude refunds that are pending approval. 7 = Approved. Exclude refunds that are approved. O or All is not valid as an exclude status and will not apply. |

### Refund

A refund.

| Field | Type | Required | Description |
|---|---|---|---|
| RefundId | string (uuid) |  | The id of the refund. |
| RefundInstanceId | integer (int32) |  | The internal id of the refund. |
| OrderId | integer (int32) |  | The order id of the order that the refund belongs to. |
| Reference | string |  | A custom refund reference. |
| Description | string |  | A custom refund description. |
| Author | string |  | The name of the author of the refund. |
| ExternalOrderId | string |  | The external order id of the order. |
| OrderTransactionId | string |  | A transaction id of the order. |
| SecondaryOrderTransactionId | string |  | An secondary transaction id of the order. |
| ExternalId | string |  | An external transaction id of the order. |
| PaymentName | string |  | The name of the payment used in the order. |
| Locale | string |  | The locale of the order. |
| SiteName | string |  | The market the order was placed on. |
| Customer | string |  | The customer name. |
| OrderSum | number (double) |  | The sum of the order. |
| OrderVat | number (double) |  | The total vat of the order. |
| OrderValue | number (double) |  | The total value of the order rows. |
| OrderDiscount | number (double) |  | THe total discount on the order. |
| ShippingFee | number (double) |  | The order shipping fee. |
| PaymentFee | number (double) |  | The order payment fee. |
| Currency | string |  | The code of the currency used for the refund. |
| CreatedOn | string (date-time) |  | The date the refund was created. |
| SentOn | string (date-time) |  | The date the refund was marked as sent. |
| ProcessedOn | string (date-time) |  | The date the refund was marked as processed. |
| Sent | boolean |  | If true, the refund has been marked as sent. |
| Processed | boolean |  | If true, the refund has been marked as processed. |
| RequiresApproval | boolean |  | True if this refund requires approval before being sent, processed or settled. |
| Approved | boolean |  | Null if undecided, true if approved and false if denied. Only applicable if RequiresApproval is true. |
| ApprovalDecidedBy | string |  | The name of the one that approved or denied the refund. |
| ApprovalDecidedOn | string (date-time) |  | The date that the refund was approved or denied. |
| VatRate | number (double) |  | Vat rate. E.g. 0.25 for 25%, 0.12 for 12%. |
| SkipRefundEvents | boolean |  | Whether or not refund events will be sent for this refund. |
| RefundedItemTotal | number (double) |  | The total amount refunded from order rows. |
| RefundedShippingFee | number (double) |  | The amount refunded from the shipping fee. |
| OrderStatus | string |  | The status of the order that the refund belongs to. |
| RefundedPaymentFee | number (double) |  | The amount refunded from the payment fee. |
| RefundedDiscount | number (double) |  | The amount refunded from the discount (can be split over several refunds). |
| Shipped | boolean |  | The shipping status of the order that the refund belongs to. |
| RefundedBalance | number (double) |  | The amount refunded from the balance (can be split over several refunds). |
| RefundedTotal | number (double) |  | Total amount refunded. |
| RefundRows | RefundRow[] |  | List of refund rows belonging to this refund. |
| Rows | Refund.Core.Models.Order.OrderRow[] |  | List of order rows belonging to this refund. |

### RefundRow

A refund row.

| Field | Type | Required | Description |
|---|---|---|---|
| OrderId | integer (int32) |  |  |
| RefundRowId | integer (int32) |  |  |
| OrderRowId | integer (int32) |  | The order row id that this refund row belongs to, if any. |
| CaptureId | string (uuid) |  | The capture id that this refund row belongs to, if any. |
| RefundAmount | number (double) |  | The refund amount. This can be different than the corresponding order row value. |
| RefundAmountExVat | number (double) |  | The refund amount excluding VAT. |
| ToBalance | boolean |  | If true, the refund amount of this refund row is added to the customer's balance. |
| Settled | boolean |  | If true, the refund row is marked as settled. |
| SettledOn | string (date-time) |  | The date when the refund row was marked as settled. |
| CreatedOn | string (date-time) |  | The date the refund row was created. |
| Investigation | boolean |  | If true, the refund row is marked for investigation. |
| RefundType | enum(0, 1, 2, 3) |  | The kind of source transaction the refund is derived from. 0 = Default. A regular refund of the order or order row. 1 = InstanceCost. Return cost type, used in drawing cost for instance. 2 = Shipping. Refund shipping type, used to refund shipping. 3 = InvoiceFee. Refund invoice fee. 0 = Default. A regular refund of the order or order row. 1 = InstanceCost. Return cost type, used in drawing cost for instance. 2 = Shipping. Refund shipping type, used to refund shipping. 3 = InvoiceFee. Refund invoice fee. |

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

