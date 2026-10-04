# PageArea

Generated on 2026-10-04 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `--path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `PageArea` | Create/update page area |
| DELETE | `PageArea/{name}` | Delete page area |
| GET | `PageArea/{name}` | Get page area |
| POST | `PageAreaFamily` | Create/update page area family |
| DELETE | `PageAreaFamily/{familyId}` | Delete page area family |
| GET | `PageAreaFamily/{familyId}` | Get page area family |
| GET | `PageAreaFamily/List` | List page area families |

## POST PageArea

Creates or updates a page area.

Body: `PageArea.Models.Write.PageArea`

Returns: `Envelope-PageArea.Models.Read.PageArea`

## DELETE PageArea/{name}

Deletes a specific page area.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| name | path | string | yes | The name of the page area to delete. |

Returns: `BaseEnvelope`

## GET PageArea/{name}

Gets a specific page area.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| name | path | string | yes | The name of the page area to get. |

Returns: `Envelope-PageArea.Models.Read.PageArea`

## POST PageAreaFamily

Creates or updates a page area family.

Body: `PageArea.Models.Write.PageAreaFamily`

Returns: `Envelope-PageArea.Models.Read.PageAreaFamily`

## DELETE PageAreaFamily/{familyId}

Deletes a specific page area family.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| familyId | path | integer (int32) | yes | The id of the page area family to delete. |

Returns: `BaseEnvelope`

## GET PageAreaFamily/{familyId}

Gets a specific page area family.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| familyId | path | integer (int32) | yes | The id of the page area family to get. |

Returns: `Envelope-PageArea.Models.Read.PageAreaFamily`

## GET PageAreaFamily/List

Gets a list of all page area families, including nested data.

Returns: `Envelope-List-PageArea.Models.Read.PageAreaFamily`

## Schemas

### PageArea.Models.Write.PageArea

The API-version of the PageArea class

| Field | Type | Required | Description |
|---|---|---|---|
| Index | integer (int32) |  | The primary id of this page are family collection |
| Name | string |  | A descriptive, user-defined name for this page area family collection |
| FamilyId | integer (int32) |  | The family this area belongs to. |
| Settings | Nullable-ValidationConfiguration |  |  |

### Envelope-PageArea.Models.Read.PageArea

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | PageArea.Models.Read.PageArea |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### PageArea.Models.Write.PageAreaFamily

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| Name | string |  |  |
| FilterableProperties | string[] |  | This page area family has access to the following properties that can be used for filtering, when rendering itself. The following properties are available: SiteId, LanguageId, ProductId, CategoryId, BrandId, InfoPageId, DiscountCampaignNumber, GenderId, Sale, UserTypeIdActiveFrom, ActiveTo |
| Areas | PageArea.Models.Write.PageArea[] |  |  |

### Envelope-PageArea.Models.Read.PageAreaFamily

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | PageArea.Models.Read.PageAreaFamily |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-PageArea.Models.Read.PageAreaFamily

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | PageArea.Models.Read.PageAreaFamily[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Nullable-ValidationConfiguration

| Field | Type | Required | Description |
|---|---|---|---|
| LazyLoadConfiguration | PageWidget.LazyLoadSetup.LazyLoadConfiguration |  |  |
| LazyLoadCollectionConfigurations | PageWidget.LazyLoadSetup.LazyLoadCollectionConfiguration[] |  |  |
| WidgetRestrictions | object |  |  |
| ContainerRestrictions | ContainerRestrictionSetup.ContainerRestrictionConfiguration |  |  |

### PageArea.Models.Read.PageArea

The API-version of the PageArea class

| Field | Type | Required | Description |
|---|---|---|---|
| Index | integer (int32) |  | The primary id of this page are family collection |
| Name | string |  | A descriptive, user-defined name for this page area family collection |
| FamilyId | integer (int32) |  | The family this area belongs to. |
| Settings | string |  | The settings that determine how containers can be added to this area. |
| Containers | PageArea.Models.Read.PageWidgetContainer[] |  | The containers in this area |

### PageArea.Models.Read.PageAreaFamily

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| Name | string |  |  |
| FilterableProperties | string |  | This page area family has access to the following properties that can be used for filtering, when rendering itself. |
| Areas | PageArea.Models.Read.PageArea[] |  |  |

### PageWidget.LazyLoadSetup.LazyLoadConfiguration

| Field | Type | Required | Description |
|---|---|---|---|
| EnableLazyloadMobile | boolean |  |  |
| EagerLoadStepsMobile | integer (int32) |  |  |
| EnableLazyloadDesktop | boolean |  |  |
| EagerLoadStepsDesktop | integer (int32) |  |  |

### PageWidget.LazyLoadSetup.LazyLoadCollectionConfiguration

| Field | Type | Required | Description |
|---|---|---|---|
| CollectionName | string |  |  |
| EnableLazyloadMobile | boolean |  |  |
| EagerLoadStepsMobile | integer (int32) |  |  |
| EnableLazyloadDesktop | boolean |  |  |
| EagerLoadStepsDesktop | integer (int32) |  |  |

### ContainerRestrictionSetup.ContainerRestrictionConfiguration

| Field | Type | Required | Description |
|---|---|---|---|
| AllowedLayouts | enum(0, 1, 2, 3, 4, 5, 6, 7, 8)[] |  |  |
| BannedWidgets | string (uuid)[] |  |  |

### PageArea.Models.Read.PageWidgetContainer

This class represents a collection of widgets, and defines how they should be layouted in the area they are rendered in.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | The primary ID of this container |
| Name | string |  | The descriptive user defined name of this container, which is used to distinguish this container in a container library |
| ClassNames | string[] |  | The CSS class names this container should use. |
| Active | boolean |  |  |
| Layout | string |  |  |
| ResponsiveMode | string |  |  |
| Visibility | string |  |  |
| Design | string |  |  |
| Widgets | PageArea.Models.Read.PageWidget[] |  | The configured widgets held by this container |

### PageArea.Models.Read.PageWidget

The API-representation of page widgets

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string (uuid) |  | The IDs of widgets are immutable. |
| Name | string |  | The static name of this widget. Used to translate into icons, or to append to css-classes. |
| Type | string |  | The name of the widget-type. |
| Active | boolean |  | Decides if this page widget is active or not. |
| ClassNames | string[] |  | Holds all CSS Class names that this widget should render. |
| Size | string |  | The fractional size for this widget in it's container. |
| Configuration | string |  | The configuration for this page widget. |

