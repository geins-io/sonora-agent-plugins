# Brand

Generated on 2026-09-24 from the Geins Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Brand` | Create brand |
| DELETE | `Brand/{id}` | Delete brand |
| GET | `Brand/{id}` | Get brand |
| PUT | `Brand/{id}` | Update brand |
| POST | `Brand/Query` | Query brands |

## POST Brand

Body: `Brand.Models.Write.Brand`

Returns: `Envelope-Brand.Models.Read.Brand`

## DELETE Brand/{id}

Deletes a specific brand by id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the brand to delete. |

Returns: `BaseEnvelope`

## GET Brand/{id}

Gets a specific brand by id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the brand to get. |

Returns: `Envelope-Brand.Models.Read.Brand`

## PUT Brand/{id}

Leaving out a property will ensure no changes are made to that property. Collection properties will delete and/or add as necessary to match the supplied data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the brand to update. |

Body: `Brand.Models.Write.Brand`

Returns: `Envelope-Brand.Models.Read.Brand`

## POST Brand/Query

Body: `Brand.Models.BrandQuery`

Returns: `Brand.Models.Read.Brand[]`

## Schemas

### Brand.Models.Write.Brand

A brand.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | The name of the brand. |
| ExternalId | string |  | External id of the brand. |
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the brand. |

### Envelope-Brand.Models.Read.Brand

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Brand.Models.Read.Brand |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Brand.Models.BrandQuery

A brand query. All fields are optional.

| Field | Type | Required | Description |
|---|---|---|---|
| CreatedAfter | string (date-time) |  | Limits query to brands created after the specified date. |
| BrandIds | integer (int32)[] |  | Limits query to only include the supplied brand ids. |
| ExternalIds | string[] |  | Limits query to externalIds |

### Brand.Models.Read.Brand

A brand.

| Field | Type | Required | Description |
|---|---|---|---|
| BrandId | integer (int32) |  | The id of the brand. |
| Name | string |  | The name of the brand. |
| ExternalId | string |  | External id of the brand. |
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the brand. |

### Shared.Models.LocalizableContent

A piece of localized content.

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageCode | string |  | The 2-letter ISO 639-1 language code for this locale. |
| Content | string |  | The localized content. |

