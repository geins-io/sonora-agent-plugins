# Redirect

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| GET | `redirect/alias/{page}` | Get a list of aliases that should be redirected. |
| GET | `redirect/url/{page}` | Get a list of URLs that should be redirected. |

## GET redirect/alias/{page}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | Page number. |
| pageSize | query | integer (int32) |  | Page Size. Optional. Default value is 1000 |
| currentCheckpoint | query | string (date-time) |  | Mandatory value. Only redirects created after this date will be returned. |
| nextCheckpoint | query | string (date-time) |  | Mandatory value. Only redirects created before this date will be returned. Use the same date when fetching pages to ensure that only the initial result set is returned. |

Returns: `Envelope-List-Redirect.Models.UrlRedirect`

## GET redirect/url/{page}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | Page number. |
| pageSize | query | integer (int32) |  | Page Size. Optional. Default value is 1000 |
| currentCheckpoint | query | string (date-time) |  | Mandatory value. Only redirects created after this date will be returned. |
| nextCheckpoint | query | string (date-time) |  | Mandatory value. Only redirects created before this date will be returned. Use the same date when fetching pages to ensure that only the initial result set is returned. |

Returns: `Envelope-List-Redirect.Models.UrlRedirect`

## Schemas

### Envelope-List-Redirect.Models.UrlRedirect

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Redirect.Models.UrlRedirect[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Redirect.Models.UrlRedirect

Contains information about an url redirect. Relative Urls are used.

| Field | Type | Required | Description |
|---|---|---|---|
| OldUrl | string |  | Old url. |
| NewUrl | string |  | New url |
| MarketId | integer (int32) |  | Market id |
| Action | string |  | Action. Update or Delete. |

