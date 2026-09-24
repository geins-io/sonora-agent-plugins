# CustomerGroup

Generated on 2026-09-24 from the Geins Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `CustomerGroup` |  |
| DELETE | `CustomerGroup/{id}` |  |
| GET | `CustomerGroup/{id}` |  |
| PUT | `CustomerGroup/{id}` |  |
| GET | `CustomerGroup/List` |  |

## POST CustomerGroup

Body: `CustomerGroup.Models.Write.CustomerGroup`

Returns: `Envelope-Int`

## DELETE CustomerGroup/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Returns: `BaseEnvelope`

## GET CustomerGroup/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Returns: `Envelope-CustomerGroup.Models.Read.CustomerGroup`

## PUT CustomerGroup/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Body: `CustomerGroup.Models.Write.CustomerGroup`

Returns: `BaseEnvelope`

## GET CustomerGroup/List

Returns: `Envelope-List-CustomerGroup.Models.Read.CustomerGroup`

## Schemas

### CustomerGroup.Models.Write.CustomerGroup

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | The name of the customer group. |
| DiscountPercentage | integer (int32) |  | Customers in this group receive this discount percentage. |

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

### Envelope-CustomerGroup.Models.Read.CustomerGroup

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | CustomerGroup.Models.Read.CustomerGroup |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-CustomerGroup.Models.Read.CustomerGroup

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | CustomerGroup.Models.Read.CustomerGroup[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### CustomerGroup.Models.Read.CustomerGroup

| Field | Type | Required | Description |
|---|---|---|---|
| CustomerGroupId | integer (int32) |  | The unique identifier of the customer group. |
| Name | string |  | The name of the customer group. |
| DiscountPercentage | integer (int32) |  | Customers in this group receive this discount percentage. |

