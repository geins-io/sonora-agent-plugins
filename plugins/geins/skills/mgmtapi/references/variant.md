# Variant

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| DELETE | `Variant/{productId}` | Remove product from variant group |
| PUT | `Variant/{productId}` | Update variant |
| DELETE | `Variant/{productId}/VariantGroup` | Delete variant group (product id) |
| GET | `Variant/{productId}/VariantGroup` | Get variant group (product id) |
| POST | `Variant/{productId}/VariantGroup` | Create variant group (product) |
| PUT | `Variant/{productId1}/{productId2}` | Add product to variant group (product) |
| POST | `Variant/Label` | Add a new variant label |
| DELETE | `Variant/Label/{label}` | Delete a variant label |
| PUT | `Variant/Label/{oldLabel}` | Update an existing variant label |
| GET | `Variant/Labels` | Get variant labels |
| POST | `VariantGroup` | Create variant group |
| DELETE | `VariantGroup/{groupId}` | Delete variant group (group id) |
| GET | `VariantGroup/{groupId}` | Get variant group (group id) |
| PUT | `VariantGroup/{groupId}` | Update variant group |
| PUT | `VariantGroup/{groupId}/{productId}` | Add product to variant group |

## DELETE Variant/{productId}

Removes a product from its variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to remove from variant group. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## PUT Variant/{productId}

Updates the variant details for the product with the provided id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product for which to update the variant details. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Variant.Models.Write.Variant[]`

Returns: `Envelope-List-Variant.Models.Read.Variant`

## DELETE Variant/{productId}/VariantGroup

Deletes an entire variant group based on product id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of a product that belongs to the variant group to remove. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Returns: `BaseEnvelope`

## GET Variant/{productId}/VariantGroup

Gets the variant group for the provided product id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product, for which to get the group. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## POST Variant/{productId}/VariantGroup

Create a new variant group for the provided product id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product for which to create the variant group. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Body: `Variant.Models.Write.VariantGroup`

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## PUT Variant/{productId1}/{productId2}

Adds a product to an existing variant group from another product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId1 | path | string | yes | The id of a product belonging to the target group. |
| productId2 | path | string | yes | The id of the product to be added to the target group. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## POST Variant/Label

Adds a new variant label.

Body: `Variant.Models.Write.VariantLabel`

Returns: `Envelope-List-System.String`

## DELETE Variant/Label/{label}

Deletes a variant label.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| label | path | string | yes | The label to delete. |

Returns: `BaseEnvelope`

## PUT Variant/Label/{oldLabel}

Updates an existing variant label.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| oldLabel | path | string | yes | The label to update. |

Body: `Variant.Models.Write.VariantLabel`

Returns: `BaseEnvelope`

## GET Variant/Labels

Gets all valid variant labels.

Returns: `Envelope-List-System.String`

## POST VariantGroup

Creates a new variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Body: `Variant.Models.Write.VariantGroup`

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## DELETE VariantGroup/{groupId}

Deletes an entire variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| groupId | path | integer (int32) | yes | The id of the variant group to delete. |

Returns: `BaseEnvelope`

## GET VariantGroup/{groupId}

Gets a specific variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| groupId | path | integer (int32) | yes | The id of the variant group to get. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## PUT VariantGroup/{groupId}

Updates the settings of a variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| groupId | path | integer (int32) | yes | The id of the variant group to update. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Body: `Variant.Models.Write.VariantGroup`

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## PUT VariantGroup/{groupId}/{productId}

Adds a product to an existing variant group.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| groupId | path | integer (int32) | yes | The id of the variant group to which a product should be added. |
| productId | path | string | yes | The id of the product to be added to the target variant group. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Comma separated list of product child collections to also include with the variant group. Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns |

Body: `Variant.Models.Write.Variant[]`

Returns: `Envelope-Variant.Models.Read.VariantGroup`

## Schemas

### Envelope-Variant.Models.Read.VariantGroup

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Variant.Models.Read.VariantGroup |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Variant.Models.Write.Variant

A variant of a product.

| Field | Type | Required | Description |
|---|---|---|---|
| Label | string |  | The name of the variant, eg "Color", "Weight" etc. |
| Value | string |  | The value of this variant, eg "Blue", "250g" etc. |

### Envelope-List-Variant.Models.Read.Variant

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Variant.Models.Read.Variant[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Variant.Models.Write.VariantGroup

A variant group for a collection of related variants.

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | The optional internal name of the variant group. |
| CollapseInLists | boolean |  | A setting to control the display behaviour in product listings of variants belonging to this group. |
| VariantLabels | string[] |  | The labels of the variant data that this group keeps track of. |
| Products | Product.Models.Write.Product[] |  | Products to be created and connected to the group. |

### Variant.Models.Write.VariantLabel

| Field | Type | Required | Description |
|---|---|---|---|
| Label | string |  |  |

### Envelope-List-System.String

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | string[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Variant.Models.Read.VariantGroup

A variant group for a collection of related variants.

| Field | Type | Required | Description |
|---|---|---|---|
| GroupId | integer (int32) |  | The id of variant goup. |
| Name | string |  | The optional internal name of the variant group. |
| CollapseInLists | boolean |  | Determine visibility of non-main products of this group in lists. |
| MainProductId | integer (int32) |  | The main product of this group. If the group is collapsed in lists, this will be the only visible product. |
| ProductIds | integer (int32)[] |  | The product ids of the variants that belong to this group. |
| Products | Product.Models.Read.Product[] |  | Products belonging to the Variant group. Only included when parameter "include" is supplied in the query string. |

### Variant.Models.Read.Variant

A variant of a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The id of the product this variant information belongs to. |
| GroupId | integer (int32) |  | The id of the group this variant belongs to. |
| Label | string |  | The name of the variant information, eg "Weight", "Length" etc. |
| Value | string |  | The value of the variant information, eg "250g", "89cm" etc. |

### Product.Models.Write.Product

A product.

| Field | Type | Required | Description |
|---|---|---|---|
| ArticleNumber | string |  | The article number of the product. |
| Names | Shared.Models.LocalizableContent[] |  | The localized names of the product. |
| Active | boolean |  | The current state of the product. |
| PurchasePrice | number (double) |  | The purchase price in the currency defined in PurchasePriceCurrency. |
| PurchasePriceCurrency | string |  | The 3-letter ISO 4217 currency code for the amount given in PurchasePrice. |
| ShortTexts | Shared.Models.LocalizableContent[] |  | Localized short texts for the product. |
| LongTexts | Shared.Models.LocalizableContent[] |  | Localized long texts for the product. |
| TechTexts | Shared.Models.LocalizableContent[] |  | Localized tech texts for the product. |
| BrandId | integer (int32) |  | The brand of the product. |
| MaxDiscountPercentage | integer (int32) |  | Maximum discount percentage for the product. |
| SupplierId | integer (int32) |  | The supplier id of the product. |
| Items | Product.Models.Write.ProductItem[] |  | The items belonging to the product. Only valid for product creation. |
| CategoryIds | integer (int32)[] |  | The category ids the product belongs to. |
| ParameterValues | ProductParameter.Models.Write.ProductParameterValue[] |  | The parameter values associated with the product. Only valid for product creation. |
| Variants | Variant.Models.Write.Variant[] |  | The variants for this product. |
| Markets | Market.Models.Market[] |  | The markets for this product. |
| FreightClassId | integer (int32) |  | Id of freight class. |
| IntrastatCode | string |  | Intrastat code of the product. |
| CountryOfOrigin | string |  | Country of orgin of product. |
| VariantGroupId | integer (int32) |  | Id of Variant Group to whom the product should be associated. |
| Vat | integer (int32) |  | ID or rate of VAT (On create and if no VAT is provided then default VAT will be used). |
| VatType | string |  | Defines how VAT parameter should be interpreted. Actual = VAT parameter is interpreted as VAT rate. VatId = VAT parameter is interpreted as VAT Id. |
| ExternalId | string |  | External id of the product. |
| ActivationDate | string (date-time) |  | Activation date for the product. |
| Weight | integer (int32) |  | The weight of the product in grams (g). Can also be set on product item level. |
| Length | integer (int32) |  | The length of the Product in millimeters (mm). Can also be set on product item level. |
| Width | integer (int32) |  | The width of the product in millimeters (mm). Can also be set on product item level. |
| Height | integer (int32) |  | The height of the product in millimeters (mm). Can also be set on product item level. |
| SortOrder | Product.Models.Write.SortOrder |  |  |

### Product.Models.Read.Product

A product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The unique identifier for the product. |
| ArticleNumber | string |  | The article number of the product. |
| Names | Shared.Models.LocalizableContent[] |  | The localized names of the product. |
| DateCreated | string (date-time) |  | The date the product was created. |
| DateUpdated | string (date-time) |  | The date the product was last updated. |
| DateFirstAvailable | string (date-time) |  | The date the product was first available. |
| MaxDiscountPercentage | integer (int32) |  | Maximum discount percentage for the product. |
| Active | boolean |  | The current state of the product. |
| PurchasePrice | number (double) |  | The purchase price in the currency defined in PurchasePriceCurrency. |
| PurchasePriceCurrency | string |  | The 3-letter ISO 4217 currency code for the amount given in PurchasePrice. |
| ShortTexts | Shared.Models.LocalizableContent[] |  | Localized short texts for the product. |
| LongTexts | Shared.Models.LocalizableContent[] |  | Localized long texts for the product. |
| TechTexts | Shared.Models.LocalizableContent[] |  | Localized tech texts for the product. |
| Items | Product.Models.Read.ProductItem[] |  | The items belonging to the product. |
| Prices | PriceList.Models.Read.PriceListPrice[] |  | The current prices of the product. |
| Categories | Category.Models.Read.Category[] |  | The categories the product belongs to. |
| Images | Product.Models.Read.Image[] |  | The images for the product |
| BrandId | integer (int32) |  | The brand id of the product. |
| BrandName | string |  | The brand name of the product. |
| SupplierId | integer (int32) |  | The supplier id of the product. |
| SupplierName | string |  | The supplier name of the product. |
| ParameterValues | ProductParameter.Models.Read.ProductParameterValue[] |  | The parameter values associated with the product. |
| Variants | Variant.Models.Read.Variant[] |  | The variants for this product. |
| Markets | Market.Models.Market[] |  | The markets for this product |
| Vat | number (double) |  | The vat percent for this product. Eg) 0.25 meaning 25% VAT. |
| PrimaryImage | string |  | The filename of this products primary image. |
| FreightClassId | integer (int32) |  | Id of freight class. |
| IntrastatCode | string |  | Intrastat code of the product. |
| CountryOfOrigin | string |  | Country of orgin of product. |
| VariantGroupId | integer (int32) |  | Id of Variant Group to which the product is associated. |
| VatId | integer (int32) |  | Id of VAT. |
| ExternalId | string |  | External Id of the product. |
| ActivationDate | string (date-time) |  | Activation date for the product. |
| Feeds | Product.Models.Read.FeedMembership[] |  | The feeds the product is a member of. |
| Urls | Product.Models.Read.ProductUrl[] |  | All canonical urls for the product. |
| MainCategoryId | integer (int32) |  | The main category id for the product. |
| RelatedProducts | Product.Models.Read.RelatedProduct[] |  | The related products for the product. |
| DiscountCampaigns | Product.Models.Read.DiscountCampaign[] |  | The discount campaigns for the product. |
| LowestPrice | Product.Models.Read.LowestPriceItem[] |  | Contains information about the lowest price during last 30 days and the legal comparison price (EU). |
| SortOrder | Product.Models.Read.SortOrder |  |  |
| Weight | integer (int32) |  | The weight of the product in grams (g). Can also be set on product item level. |
| Length | integer (int32) |  | The length of the product in millimeters (mm). Can also be set on product item level. |
| Width | integer (int32) |  | The width of the product in millimeters (mm). Can also be set on product item level. |
| Height | integer (int32) |  | The height of the product in millimeters (mm). Can also be set on product item level. |

### Shared.Models.LocalizableContent

A piece of localized content.

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageCode | string |  | The 2-letter ISO 639-1 language code for this locale. |
| Content | string |  | The localized content. |

### Product.Models.Write.ProductItem

A product item belonging to a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ItemId | integer (int32) |  | Id of the product item. |
| ArticleNumber | string |  | The article number for the product item. |
| Name | string |  | The name of the product item. |
| Shelf | string |  | The shelf name where the product item can be found. |
| Weight | integer (int32) |  | The weight of the item in grams (g). |
| Length | integer (int32) |  | The length of the item in millimeters (mm). |
| Width | integer (int32) |  | The width of the item in millimeters (mm). |
| Height | integer (int32) |  | The height of the item in millimeters (mm). |
| Gtin | string |  | The GTIN number for the item. Also known as EAN, UCC or UPS number. |
| Active | boolean |  | The current state of the item. |
| ExternalId | string |  | External Id of the product item. |
| DateIncoming | string (date-time) |  | The date the item will be in stock again. |

### ProductParameter.Models.Write.ProductParameterValue

A parameter value for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The product id of the parameter. This value can be omitted if the value is part of a product request. |
| ParameterId | integer (int32) |  | The unique identifier of the parameter that this value belongs to. |
| Value | string |  | The identifying value of the parameter. Although always presented as a string, the data within Value must validate against the ProductParameterType of the parameter: String = Any string. Float = Any floating point number. DateTime = Any date. Multi = Any predefined value id from the predefined set of values for this parameter. Single = Any predefined value id from the predefined set of values for this parameter. Headline = Any string. Tags = Any string, as part of a pipe-separated list. A string containing the pipe (\|) character is not allowed. |
| LocalizedDescriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the parameter. Only used for parameter types String or Headline. |

### Market.Models.Market

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Market id. |
| ChannelId | string |  | Channel id. Format: {Id}\|{MarketTopDomain} |
| Name | string |  | Market Name. |
| DisplayName | string |  | Market display name. |
| Url | string |  | Market url. |
| Currency | string |  | Default currency iso code of the market. |
| VatRate | number (double) |  | Default VAT Rate of the market. |
| MarketPrefix | string |  | Market prefix. Usually the top level domain of the market. |
| CountryId | integer (int32) |  | Default country Id of the market. |
| CurrencyId | integer (int32) |  | Default currency Id of the market. |
| CurrencyRate | number (double) |  | Currency rate of the default currency. |
| LanguageId | integer (int32) |  | Default language Id of the market. |
| Language | string |  | Default language iso code of the market. |
| Languages | Market.Models.LanguageItem[] |  | All languages of the market. |
| Countries | Market.Models.CountryItem[] |  | All countries of the market. |
| Currencies | Market.Models.CurrencyItem[] |  | All currencies of the market. |

### Product.Models.Write.SortOrder

Custom sort values for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| Custom1 | integer (int32) |  | Custom sort value 1. |
| Custom2 | integer (int32) |  | Custom sort value 2. |
| Custom3 | integer (int32) |  | Custom sort value 3. |
| Custom4 | integer (int32) |  | Custom sort value 4. |
| Custom5 | integer (int32) |  | Custom sort value 5. |

### Product.Models.Read.ProductItem

A product item belonging to a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ItemId | integer (int32) |  | The product item id. |
| ArticleNumber | string |  | The article number for the product item. |
| ProductId | integer (int32) |  | The id of the product that the item belongs to. |
| Name | string |  | The name of the product item. |
| Shelf | string |  | The shelf name where the product item can be found. |
| Weight | integer (int32) |  | The weight of the item in grams (g). |
| Length | integer (int32) |  | The length of the item in millimeters (mm). |
| Width | integer (int32) |  | The width of the item in millimeters (mm). |
| Height | integer (int32) |  | The height of the item in millimeters (mm). |
| Gtin | string |  | The GTIN number for the item. Also known as EAN, UCC or UPS number. |
| DateCreated | string (date-time) |  | The date the item was created. |
| DateUpdated | string (date-time) |  | The date the item was last updated. |
| DateIncoming | string (date-time) |  | The date the item will be in stock again. |
| Active | boolean |  | The current state of the item. |
| ExternalId | string |  | External Id of the product item. |
| Stock | Product.Models.Read.ProductItemStock |  |  |
| ShippingFees | Product.Models.Read.ShippingFee[] |  | The lowest shipping fees for each market and country for the product item. |

### PriceList.Models.Read.PriceListPrice

A price for a product on a specific price list.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The id of the product that this price applies to. |
| PriceListId | integer (int32) |  | The id of the price list that this price is associated with. |
| PriceListName | string |  | The name of the price list that this price is associated with. |
| PriceIncVat | number (double) |  | The price, inc VAT, in the currency of the associated price list. |
| PriceExVat | number (double) |  | The price, ex VAT, in the currency of the associated price list. |
| VatRate | number (double) |  | The VAT Rate. |
| Country | string |  | The 2-letter ISO country code for this price. |
| Currency | string |  | The 3-letter ISO 4217 currency code for this price. |
| StaggeredCount | integer (int32) |  | Staggered count for this price. Defaults to 1. This field is ignored for prices on default (Ordinary, Sale and Campaign) price lists. |
| ValidFrom | string (date-time) |  | The date the price is valid from. No start boundary if null. |
| ValidTo | string (date-time) |  | The date the price is valid to. No end boundary if null. |

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

### Product.Models.Read.Image

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  |  |
| Url | string |  | Url of Image. |
| Order | integer (int32) |  | Order of image (ascending). First image is the main image for the product. |
| Tags | string[] |  | The tags associated with this image. |

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

### Product.Models.Read.FeedMembership

A product feed membership.

| Field | Type | Required | Description |
|---|---|---|---|
| FeedId | integer (int32) |  | The feed id. |
| AllowSale | boolean |  | True if the feed is allowed to display the sale price of the product. |

### Product.Models.Read.ProductUrl

A canonical product url for a specific market and language.

| Field | Type | Required | Description |
|---|---|---|---|
| Url | string |  | The canonical url to the product. |
| Market | integer (int32) |  | The market of the url. |
| Countries | string[] |  | The countries or regions of the url. |
| Language | string |  | The language code of the url. |

### Product.Models.Read.RelatedProduct

A related product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The unique identifier for the product. |
| RelatedProductId | integer (int32) |  | The unique identifier for the related product. |
| RelationTypeId | integer (int32) |  | The product relation type id. |

### Product.Models.Read.DiscountCampaign

| Field | Type | Required | Description |
|---|---|---|---|
| CampaignId | string (uuid) |  | Id of Campaign. |
| CampaignName | string |  | Name of Campaign. |
| Title | string |  | Title that can be displayed for the product. |
| HideTitle | boolean |  | Indicates if the title should be displayed. |
| RuleType | string |  | Type of discount rule. I.e. Percentage. |
| Category | string |  | Campaign Category. Cart, PromoCode or Product. |
| Enabled | boolean |  | true if campaign is enabled. |
| ValidFrom | string (date-time) |  | Valid from. |
| ValidTo | string (date-time) |  | Valid to. |
| Markets | string |  | List of markets where the campaign is available in fthe format {domain\|marketId}. |
| Action | string |  |  |
| ActionValue | string |  |  |
| Quantity | integer (int32) |  |  |
| Titles | Shared.Models.LocalizableContent[] |  |  |
| Urls | Shared.Models.LocalizableContent[] |  |  |

### Product.Models.Read.LowestPriceItem

| Field | Type | Required | Description |
|---|---|---|---|
| LowestPrice | number (double) |  |  |
| ComparisonPrice | number (double) |  |  |
| MarketId | integer (int32) |  |  |
| Currency | string |  |  |

### Product.Models.Read.SortOrder

Sort order values for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| Default | integer (int32) |  | Default sort value. Is usually calculated from the products availability date and cannot be set manually. |
| Custom1 | integer (int32) |  | Custom sort value 1. |
| Custom2 | integer (int32) |  | Custom sort value 2. |
| Custom3 | integer (int32) |  | Custom sort value 3. |
| Custom4 | integer (int32) |  | Custom sort value 4. |
| Custom5 | integer (int32) |  | Custom sort value 5. |

### Market.Models.LanguageItem

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageId | integer (int32) |  | Language id. |
| Name | string |  | Language Name |
| Code | string |  | ISO code of the language. |

### Market.Models.CountryItem

| Field | Type | Required | Description |
|---|---|---|---|
| CountryId | integer (int32) |  | Country id. |
| Name | string |  | Country Name |
| Code | string |  | ISO code of the country. |
| VatRate | number (double) |  | VAT Rate of the country. |
| CurrencyId | integer (int32) |  | Currency id of the country. |

### Market.Models.CurrencyItem

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  | Currency Name. |
| Code | string |  | Iso code of the currency. |
| CurrencyId | integer (int32) |  | Currency id. |
| CurrencyRate | number (double) |  | Currency rate. |

### Product.Models.Read.ProductItemStock

A stock value for a product item

| Field | Type | Required | Description |
|---|---|---|---|
| ItemId | integer (int32) |  | A value to uniquely identity a single product item. |
| Stock | integer (int32) |  | The physical stock value. |
| StockOversellable | integer (int32) |  | The oversellable stock value. |
| StockStatic | integer (int32) |  | The static stock value. |
| StockSellable | integer (int32) |  | The sellable stock value. |

### Product.Models.Read.ShippingFee

A shipping fee for a product item.

| Field | Type | Required | Description |
|---|---|---|---|
| Market | integer (int32) |  | The market that the shipping fee is applicable on. |
| Country | string |  | The country that the shipping fee is applicable in. |
| Service | string |  | The shipping service with the current fee. |
| ServiceId | integer (int32) |  | The shipping service id with the current fee. |
| Fee | number (double) |  | The shipping fee. |

### Category.Models.CategoryMeta

Meta information for a category.

| Field | Type | Required | Description |
|---|---|---|---|
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized meta descriptions of the category. |
| Keywords | Shared.Models.LocalizableContent[] |  | The localized meta keywords of the category. |
| Titles | Shared.Models.LocalizableContent[] |  | The localized meta titles of the category. |

