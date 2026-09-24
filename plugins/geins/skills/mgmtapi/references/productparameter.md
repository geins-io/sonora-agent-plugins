# ProductParameter

Generated on 2026-09-24 from the Geins Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `ProductParameter` | Create product parameter |
| GET | `ProductParameter/{id}` | Get product parameter |
| PUT | `ProductParameter/{id}` | Update product parameter |
| POST | `ProductParameter/Group` | Create product parameter group |
| GET | `ProductParameter/Group/{id}` | Get product parameter group |
| PUT | `ProductParameter/Group/{id}` | Update product parameter group |
| POST | `ProductParameter/PredefinedValue` | Create product parameter predefined value |
| GET | `ProductParameter/PredefinedValue/{id}` | Get product parameter predefined value |
| PUT | `ProductParameter/PredefinedValue/{predefinedValueId}` | Update product parameter predefined value names |
| POST | `ProductParameter/Value` | Create/update product parameter value (Obsolete) |
| GET | `ProductParameter/Value/{id}` | Get product parameter value (Obsolete) |
| POST | `ProductParameter/Values` | Replace product parameter values (batch) (Obsolete) |
| PUT | `ProductParameter/Values` | Update product parameter values (batch) (Obsolete) |

## POST ProductParameter

Creates a new product parameter.

Body: `ProductParameter.Models.Write.ProductParameter`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameter`

## GET ProductParameter/{id}

Gets a specific product parameter

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the product parameter to get. |

Returns: `Envelope-ProductParameter.Models.Read.ProductParameter`

## PUT ProductParameter/{id}

Updates a product parameter. Leaving out a property will ensure no changes are made to that property. Collection properties will delete and/or add as necessary to match the supplied data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the product parameter to update. |

Body: `ProductParameter.Models.Write.ProductParameter`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameter`

## POST ProductParameter/Group

Creates a new product parameter group.

Body: `ProductParameter.Models.Write.ProductParameterGroup`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterGroup`

## GET ProductParameter/Group/{id}

Gets a specific product parameter group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the product parameter group to get. |

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterGroup`

## PUT ProductParameter/Group/{id}

Updates a product parameter group. Leaving out a property will ensure no changes are made to that property. Collection properties will delete and/or add as necessary to match the supplied data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the product parameter group to update. |

Body: `ProductParameter.Models.Write.ProductParameterGroup`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterGroup`

## POST ProductParameter/PredefinedValue

Creates a new predefined value for a product parameter.

Body: `ProductParameter.Models.Write.ProductParameterPredefinedValue`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterPredefinedValue`

## GET ProductParameter/PredefinedValue/{id}

Gets a specific predefined value for a product parameter.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the predefined value to get. |

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterPredefinedValue`

## PUT ProductParameter/PredefinedValue/{predefinedValueId}

Updates localized names for a product parameter predefined value.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| predefinedValueId | path | integer (int32) | yes | The id of the predefined value to update. |

Body: `Shared.Models.LocalizableContent[]`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterPredefinedValue`

## POST ProductParameter/Value

Creates or updates a new product parameter value. Note that this endpoint is obsolete and will be removed in a future version. Use API/Product/{productId}/Parameter/{parameterId} instead.

Body: `ProductParameter.Models.Write.ProductParameterValue`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterValue`

## GET ProductParameter/Value/{id}

Gets a specific product parameter value. Note that this endpoint is obsolete and will be removed in a future version. Use API/Product/{productId}/Parameter/{parameterId} instead.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes | The id of the product parameter value to get. |
| predefinedValueId | query | string |  | The predefined value id of the product parameter value to get. Only applicable for parameter type Multi. |

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterValue`

## POST ProductParameter/Values

Replaces multiple product parameter values. Any existing product parameter values that is *not* supplied in the request will be removed from the product. Note that this endpoint is obsolete and will be removed in a future version. Use API/Product/Parameter/Values instead.

Body: `ProductParameter.Models.Write.ProductParameterValueBatch`

Returns: `BaseEnvelope`

## PUT ProductParameter/Values

Updates multiple product parameter values. Any existing product parameter values not supplied in the request will remain on the product. Note that this endpoint is obsolete and will be removed in a future version. Use API/Product/Parameter/Values instead.

Body: `ProductParameter.Models.Write.ProductParameterValueBatch`

Returns: `BaseEnvelope`

## Schemas

### ProductParameter.Models.Write.ProductParameter

A product parameter to create or update.

| Field | Type | Required | Description |
|---|---|---|---|
| ParameterId | integer (int32) |  | The unique identifier for the parameter. |
| GroupId | integer (int32) |  | The unique identifier of the group that this parameter belongs to. |
| ParameterType | enum(1, 2, 3, 4, 5, 6, 7) |  | The type of parameter. 1 = String. Any string value. 2 = Float. Any floating point number. Period as decimal separator and no thousands separator. Eg: 10001.789. 3 = DateTime. Any ISO 8601 date. Eg: 2017-03-06T16:31:24+02:00. 4 = Multi. A string value from a predefined set of values. This type may occur multiple times for the same parameter. 5 = Single. A string value from a predefined set of values. 6 = Headline. A string value used mainly for grouping in layout. 7 = Tags. A pipe-separated list of product specific values. Eg: red\|green\|blue. |
| Name | string |  | The non-localized name of the parameter. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized names of the parameter. |

### Envelope-ProductParameter.Models.Read.ProductParameter

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ProductParameter.Models.Read.ProductParameter |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### ProductParameter.Models.Write.ProductParameterGroup

A product parameter group to create or update.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | The non-localized name of the group. |
| Order | integer (int32) |  | The order of the group. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized names of the group. |
| ParameterIds | integer (int32)[] |  | The ids of the parameters belonging to this group. |

### Envelope-ProductParameter.Models.Read.ProductParameterGroup

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ProductParameter.Models.Read.ProductParameterGroup |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### ProductParameter.Models.Write.ProductParameterPredefinedValue

A predefined value for a product parameter. The value defined here is used for parameters of type Single and Multi.

| Field | Type | Required | Description |
|---|---|---|---|
| ParameterId | integer (int32) |  | The unique identifier for the parameter. |
| PredefinedValueId | integer (int32) |  | The predefined value id of the parameter. |
| Name | string |  | The non-localized predefined value name of the parameter. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized predefined value names of the parameter. |

### Envelope-ProductParameter.Models.Read.ProductParameterPredefinedValue

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ProductParameter.Models.Read.ProductParameterPredefinedValue |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Shared.Models.LocalizableContent

A piece of localized content.

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageCode | string |  | The 2-letter ISO 639-1 language code for this locale. |
| Content | string |  | The localized content. |

### ProductParameter.Models.Write.ProductParameterValue

A parameter value for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The product id of the parameter. This value can be omitted if the value is part of a product request. |
| ParameterId | integer (int32) |  | The unique identifier of the parameter that this value belongs to. |
| Value | string |  | The identifying value of the parameter. Although always presented as a string, the data within Value must validate against the ProductParameterType of the parameter: String = Any string. Float = Any floating point number. DateTime = Any date. Multi = Any predefined value id from the predefined set of values for this parameter. Single = Any predefined value id from the predefined set of values for this parameter. Headline = Any string. Tags = Any string, as part of a pipe-separated list. A string containing the pipe (\|) character is not allowed. |
| LocalizedDescriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the parameter. Only used for parameter types String or Headline. |

### Envelope-ProductParameter.Models.Read.ProductParameterValue

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ProductParameter.Models.Read.ProductParameterValue |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### ProductParameter.Models.Write.ProductParameterValueBatch

| Field | Type | Required | Description |
|---|---|---|---|
| productParameterValues | ProductParameter.Models.Write.ProductParameterValue[] |  |  |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### ProductParameter.Models.Read.ProductParameter

An existing product parameter.

| Field | Type | Required | Description |
|---|---|---|---|
| ParameterId | integer (int32) |  | The unique identifier for the parameter. |
| GroupId | integer (int32) |  | The unique identifier of the group that this parameter belongs to. |
| GroupName | string |  | The name of the group that this parameter belongs to. |
| ParameterType | enum(1, 2, 3, 4, 5, 6, 7) |  | The type of parameter. 1 = String. Any string value. 2 = Float. Any floating point number. Period as decimal separator and no thousands separator. Eg: 10001.789. 3 = DateTime. Any ISO 8601 date. Eg: 2017-03-06T16:31:24+02:00. 4 = Multi. A string value from a predefined set of values. This type may occur multiple times for the same parameter. 5 = Single. A string value from a predefined set of values. 6 = Headline. A string value used mainly for grouping in layout. 7 = Tags. A pipe-separated list of product specific values. Eg: red\|green\|blue. |
| Name | string |  | The non-localized name of the parameter. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized names of the parameter. |
| PredefinedValues | ProductParameter.Models.Read.ProductParameterPredefinedValue[] |  | List of predefined values for the parameter. Only used for Single and Multi types. |

### ProductParameter.Models.Read.ProductParameterGroup

An existing product parameter group.

| Field | Type | Required | Description |
|---|---|---|---|
| GroupId | integer (int32) |  | The unique identifier for the groups. |
| Name | string |  | The non-localized name of the group. This name is required, but will be overriden by LocalizedNames for any matching locales. |
| Order | integer (int32) |  | The order of the group. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized names of the group. These names are optional, and will override Name for matching locales. |
| ParameterIds | integer (int32)[] |  | The ids of the parameters belonging to this group. |

### ProductParameter.Models.Read.ProductParameterPredefinedValue

A predefined value for a product parameter. The value defined here is used for parameters of type Single and Multi.

| Field | Type | Required | Description |
|---|---|---|---|
| ParameterId | integer (int32) |  | The unique identifier for the parameter. |
| PredefinedValueId | integer (int32) |  | The predefined value id of the parameter. This value is used in ProductParameterValue.Value. |
| Name | string |  | The non-localized predefined value name of the parameter. |
| LocalizedNames | Shared.Models.LocalizableContent[] |  | The localized predefined value names of the parameter. |

### ProductParameter.Models.Read.ProductParameterValue

A parameter value for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ParameterValueId | integer (int32) |  | The unique identifier of this parameter value. |
| ProductId | integer (int32) |  | The product id of the parameter. |
| ParameterId | integer (int32) |  | The unique identifier of the parameter that this value belongs to. |
| ParameterName | string |  | The non-localized name of the parameter. |
| GroupId | integer (int32) |  | The unique identifier of the group that this parameter belongs to. |
| GroupName | string |  | The name of the group that this parameter belongs to. |
| ParameterType | enum(1, 2, 3, 4, 5, 6, 7) |  | The type of parameter. The Value field must validate against this type. 1 = String. Any string value. 2 = Float. Any floating point number. Period as decimal separator and no thousands separator. Eg: 10001.789. 3 = DateTime. Any ISO 8601 date. Eg: 2017-03-06T16:31:24+02:00. 4 = Multi. A string value from a predefined set of values. This type may occur multiple times for the same parameter. 5 = Single. A string value from a predefined set of values. 6 = Headline. A string value used mainly for grouping in layout. 7 = Tags. A pipe-separated list of product specific values. Eg: red\|green\|blue. |
| Value | string |  | The identifying value of the parameter. Although always presented as a string, the data within Value must validate against the type of the parameter: String = Any string. Float = Any floating point number. DateTime = Any date. Multi = Any predefined value id from the predefined set of values for this parameter. Single = Any predefined value id from the predefined set of values for this parameter. Headline = Any string. |
| Description | string |  | The non-localized description of the parameter. This is usually the same value as Value for all parameter types, except Single Multi. |
| LocalizedDescriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the parameter. Not used for parameter types Float or DateTime. |
| InternalIdentifier | string |  | The internal identifier of the parameter. |
| Order | string |  | Value indicating order of the parameter value. The value takes the order of the parameter into account. Formula: (ParameterOrder * 10000) + ParameterValueOrder. |

