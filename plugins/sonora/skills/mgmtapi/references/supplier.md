# Supplier

Generated on 2026-09-25 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Supplier` | Create supplier |
| GET | `Supplier/{id}` | Get supplier |
| PUT | `Supplier/{id}` | Update supplier |
| POST | `Supplier/Query` | Query suppliers |

## POST Supplier

Creates a new supplier.

Body: `Supplier.Models.Write.Supplier`

Returns: `Envelope-Supplier.Models.Read.Supplier`

## GET Supplier/{id}

Gets a specific supplier.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the supplier to get. |

Returns: `Envelope-Supplier.Models.Read.Supplier`

## PUT Supplier/{id}

Updates a supplier. Leaving out a property will ensure no changes are made to that property. Collection properties will delete and/or add as necessary to match the supplied data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the supplier to update. |

Body: `Supplier.Models.Write.Supplier`

Returns: `Envelope-Supplier.Models.Read.Supplier`

## POST Supplier/Query

Body: `Supplier.Models.SupplierQuery`

Returns: `Supplier.Models.Read.Supplier[]`

## Schemas

### Supplier.Models.Write.Supplier

A product supplier.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | The name of the supplier. |
| Address1 | string |  | The first address line of the supplier. |
| Address2 | string |  | The second address line of the supplier. |
| Address3 | string |  | The third address line of the supplier. |
| ZipCode | string |  | The zip code of the supplier. |
| City | string |  | The city of the supplier. |
| Country | string |  | The country of the supplier. |
| ContactPerson | string |  | The contact person of the supplier. |
| Phone1 | string |  | The primary phone number of the supplier. |
| Phone2 | string |  | The secondary phone number of the supplier. |
| Email | string |  | The email address of the supplier. |
| ExternalId | string |  | External Id of the supplier. |

### Envelope-Supplier.Models.Read.Supplier

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Supplier.Models.Read.Supplier |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Supplier.Models.SupplierQuery

A supplier query. All fields are optional.

| Field | Type | Required | Description |
|---|---|---|---|
| NameContains | string |  | Limits query to suppliers with a name containing the specified string. |
| ExternalIds | string[] |  | Limits query to externalIds. |

### Supplier.Models.Read.Supplier

A product supplier.

| Field | Type | Required | Description |
|---|---|---|---|
| SupplierId | integer (int32) |  | The unique identifier for the supplier. |
| Name | string |  | The name of the supplier. |
| Address1 | string |  | The first address line of the supplier. |
| Address2 | string |  | The second address line of the supplier. |
| Address3 | string |  | The third address line of the supplier. |
| ZipCode | string |  | The zip code of the supplier. |
| City | string |  | The city of the supplier. |
| Country | string |  | The country of the supplier. |
| ContactPerson | string |  | The contact person of the supplier. |
| Phone1 | string |  | The primary phone number of the supplier. |
| Phone2 | string |  | The secondary phone number of the supplier. |
| Email | string |  | The email address of the supplier. |
| ExternalId | string |  | External Id of the supplier. |

