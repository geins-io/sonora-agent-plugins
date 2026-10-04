# Category

Generated on 2026-10-04 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `--path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Category` | Create category |
| GET | `Category/{id}` | Get category |
| PUT | `Category/{id}` | Update category |
| POST | `Category/Query` | Query categories |

## Pitfalls

Behaviour the spec does not state. Read before writing to this resource. Items marked *(unverified)* were reported from another client and have not been reproduced against a live account; trust them less, and read back to check.

- **A new category is inactive unless the body says `"Active": true`.** The create succeeds, but
  products assigned to an inactive category do not show under it. There is no `DELETE` for
  categories, so a mistaken create stays: get the body right first.

## POST Category

Body: `Category.Models.Write.Category`

Returns: `Envelope-Category.Models.Read.Category`

## GET Category/{id}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the category to get. |

Returns: `Envelope-Category.Models.Read.Category`

## PUT Category/{id}

Leaving out a property will ensure no changes are made to that property. Collection properties will delete and/or add as necessary to match the supplied data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the category to update. |

Body: `Category.Models.Write.Category`

Returns: `Envelope-Category.Models.Read.Category`

## POST Category/Query

Body: `Category.Models.CategoryQuery`

Returns: `Category.Models.Read.Category[]`

## Schemas

### Category.Models.Write.Category

A category to create or update.

| Field | Type | Required | Description |
|---|---|---|---|
| ParentCategoryId | integer (int32) |  | The ID of the parent category. Set to 0 for a root-level category. |
| Names | Shared.Models.LocalizableContent[] |  | The localizable names of the category. Note that other localizable content will only be used if a name in the same language is also provided. |
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the category. Note that only descriptions with a matching name in the same language will be used. |
| SecondaryDescriptions | Shared.Models.LocalizableContent[] |  | The localized secondary descriptions of the category. Note that only secondary descriptions with a matching name in the same language will be used. |
| Meta | Category.Models.CategoryMeta |  |  |
| Hidden | boolean |  | Indicates if the category should be hidden from menus, filters etc. |
| Active | boolean |  | True if the category is active for use. |

### Envelope-Category.Models.Read.Category

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Category.Models.Read.Category |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Category.Models.CategoryQuery

A query to filter categories by. All fields are optional.

| Field | Type | Required | Description |
|---|---|---|---|
| CreatedAfter | string (date-time) |  | Limits query to categories created after the specified date. |
| CategoryIds | integer (int32)[] |  | Limits query to only include the supplied category ids. |

### Category.Models.Read.Category

An existing category.

| Field | Type | Required | Description |
|---|---|---|---|
| CategoryId | integer (int32) |  | The id of the category. |
| ParentCategoryId | integer (int32) |  | The id of the parent category. If the category is at the root level, this field will be 0. |
| Names | Shared.Models.LocalizableContent[] |  | The localizable names of the category. |
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the category. |
| SecondaryDescriptions | Shared.Models.LocalizableContent[] |  | The localized secondary descriptions of the category. |
| Meta | Category.Models.CategoryMeta |  |  |
| GoogleCategoryPath | string |  | The Google Taxonomy category path for the category, if any. |
| Hidden | boolean |  | Indicates if the category should be hidden from menus, filters etc. |
| Active | boolean |  | True if the category is active for use. |

### Shared.Models.LocalizableContent

A piece of localized content.

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageCode | string |  | The 2-letter ISO 639-1 language code for this locale. |
| Content | string |  | The localized content. |

### Category.Models.CategoryMeta

Meta information for a category.

| Field | Type | Required | Description |
|---|---|---|---|
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized meta descriptions of the category. |
| Keywords | Shared.Models.LocalizableContent[] |  | The localized meta keywords of the category. |
| Titles | Shared.Models.LocalizableContent[] |  | The localized meta titles of the category. |

