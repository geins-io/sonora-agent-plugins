# Sitemap

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| GET | `Sitemap/{market}` | Get sitemap |

## GET Sitemap/{market}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| market | path | string | yes | The market name to retrieve a sitemap for. Eg "myshop.com". |

Returns: `JsonSitemap`

## Schemas

### JsonSitemap

A JSON representation of a sitemap.

| Field | Type | Required | Description |
|---|---|---|---|
| Urlset | JsonSitemap.UrlEntry[] |  | All urls present in the sitemap. |

### JsonSitemap.UrlEntry

An url entry in the sitemap.

| Field | Type | Required | Description |
|---|---|---|---|
| Url | string |  | The url of the entry. |
| Type | string |  | The type of entity that the url points to. This can be one of the following: Brand, Category, Product, Page, DiscountCampaign, ParameterValue. |
| Hreflang | string |  | A value suitable for use as hreflang. |

