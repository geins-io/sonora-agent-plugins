# Product

Generated on 2026-09-25 from the Sonora Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Product` | Create product |
| DELETE | `Product/{productId}` | Delete product |
| GET | `Product/{productId}` | Get product |
| PUT | `Product/{productId}` | Update product |
| PUT | `Product/{productId}/Category` | Add category to product |
| POST | `Product/{productId}/Item` | Create product item |
| DELETE | `Product/{productId}/Parameter/{parameterId}` | Remove product parameter assignment from product |
| GET | `Product/{productId}/Parameter/{parameterId}` | Get product parameter value |
| POST | `Product/{productId}/Parameter/{parameterId}` | Add product parameter value to product |
| PUT | `Product/{productId}/Related` | Add related products to a product |
| PUT | `Product/{productId}/Related/{relationTypeId}` | Link related products |
| PUT | `Product/{productId}/UnlinkRelated/{relationTypeId}` | Unlink related products (via relation). |
| GET | `Product/Feeds` | List feeds |
| GET | `Product/Item/{itemId}` | Get product item |
| PUT | `Product/Item/{itemId}` | Update product item |
| GET | `Product/Items` | List product items |
| PUT | `Product/Items` | Update product items (batch) |
| GET | `Product/Items/{page}` | List product items (paged) |
| POST | `Product/MonitorAvailability` | Add availability monitor |
| POST | `Product/Parameter/Values` | Replace product parameter values (batch) |
| PUT | `Product/Parameter/Values` | Update product parameter values (batch) |
| PATCH | `Product/Parameter/Values/Remove` | Remove multiple product parameter assignments from products. |
| PUT | `Product/PurchasePrice` | Update product purchase prices (batch) |
| POST | `Product/Query` | Query products |
| POST | `Product/Query/{page}` | Query products (paged) |
| GET | `Product/RelationTypes` | List product relation types |
| POST | `Product/RelationTypes` | Create product relation type |
| DELETE | `Product/RelationTypes/{id}` | Delete product relation type |
| GET | `Product/RelationTypes/{id}` | Get product relation type |
| PUT | `Product/RelationTypes/{id}` | Update product relation type |
| PUT | `Product/SortOrder` | Update product sort orders (batch) |
| PUT | `Product/Stock` | Update stock (batch) |
| POST | `Product/Stock/Query` | Query stock |

## POST Product

Creates a new product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| include | query | string |  | Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns, LowestPrice, Meta |

Body: `Product.Models.Write.Product`

Returns: `Envelope-Product.Models.Read.Product`

## DELETE Product/{productId}

Deletes a specific product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to delete. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Returns: `BaseEnvelope`

## GET Product/{productId}

Gets a specific product. Make sure to include relevant child-collections in the request.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to get. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns, LowestPrice, Meta |

Returns: `Envelope-Product.Models.Read.Product`

## PUT Product/{productId}

Updates a product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |
| include | query | string |  | Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns, LowestPrice, Meta |

Body: `Product.Models.Write.Product`

Returns: `Envelope-Product.Models.Read.Product`

## PUT Product/{productId}/Category

Adds a category relation to a product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.ProductCategory`

Returns: `BaseEnvelope`

## POST Product/{productId}/Item

Creates a new product item.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to create an item on. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.ProductItem`

Returns: `Envelope-Product.Models.Read.ProductItem`

## DELETE Product/{productId}/Parameter/{parameterId}

Remove a parameter assignment from a product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | integer (int32) | yes | The id of the product. |
| parameterId | path | integer (int32) | yes | The id of the product parameter to remove from this product. |

Returns: `BaseEnvelope`

## GET Product/{productId}/Parameter/{parameterId}

Gets a specific product parameter value.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | integer (int32) | yes | The id of the product. |
| parameterId | path | integer (int32) | yes | The id of the product parameter. |

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterValue`

## POST Product/{productId}/Parameter/{parameterId}

Add or update a parameter value for a product.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | integer (int32) | yes | The id of the product. |
| parameterId | path | integer (int32) | yes | The id of the product parameter to create for this product. |

Body: `ProductParameter.Models.Write.ProductParameterValueItem`

Returns: `Envelope-ProductParameter.Models.Read.ProductParameterValue`

## PUT Product/{productId}/Related

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the main product to which the relations will be created |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied in productId and relatedProducts. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.RelatedProduct[]`

Returns: `Product.Models.RelatedProductEnvelope`

## PUT Product/{productId}/Related/{relationTypeId}

Add related products to a product using a fixed relation type.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the main product to which the relations will be created. |
| relationTypeId | path | integer (int32) | yes | The relation type id that will apply to all related products in relatedProducts. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied in productId and relatedProducts. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.RelatedProduct[]`

Returns: `Product.Models.RelatedProductEnvelope`

## PUT Product/{productId}/UnlinkRelated/{relationTypeId}

Remove related products from a product using a fixed relation type.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the main product from which the relations will be removed. |
| relationTypeId | path | integer (int32) | yes | The relation type id that will apply to all related products in relatedProducts. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied in productId and relatedProducts. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.RelatedProduct[]`

Returns: `Product.Models.RelatedProductEnvelope`

## GET Product/Feeds

Gets a list of all feeds.

Returns: `Envelope-List-Product.Models.Read.Feed`

## GET Product/Item/{itemId}

Gets a specific product item (SKU).

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| itemId | path | string | yes | The id of the product item to get. |
| productItemIdType | query | enum(0, 1, 2, 3, 4) |  | The type of product item id supplied. 0 = Internal. Internal product item id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product item id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. 4 = ExternalId. External product item id set by customer. Eg: 10001. |

Returns: `Product.Models.ProductItemEnvelope`

## PUT Product/Item/{itemId}

Updates a product item.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| itemId | path | string | yes | The id of the product item to update. |
| productItemIdType | query | enum(0, 1, 2, 3, 4) |  | The type of product item id supplied. 0 = Internal. Internal product item id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product item id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. 4 = ExternalId. External product item id set by customer. Eg: 10001. |

Body: `Product.Models.Write.ProductItem`

Returns: `Envelope-Product.Models.Read.ProductItem`

## GET Product/Items

Gets all product items.

Returns: `Product.Models.Read.ProductItem[]`

## PUT Product/Items

Updates product items in batch.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productItemIdType | query | enum(0, 1, 2, 3, 4) |  | The type of product item ids supplied. 0 = Internal. Internal product item id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product item id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. 4 = ExternalId. External product item id set by customer. Eg: 10001. |

Body: `Product.Models.Write.ProductItem[]`

Returns: `Envelope-Product.Models.Read.ProductItemResult`

## GET Product/Items/{page}

Gets all product items with pagination.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | The page to fetch. |

Returns: `Envelope-List-Product.Models.Read.ProductItem`

## POST Product/MonitorAvailability

Adds a product availability monitor.

Body: `Product.Models.MonitorSku`

Returns: `BaseEnvelope`

## POST Product/Parameter/Values

Replaces multiple product parameter values. Any existing product parameter values that is *not* supplied in the request will be removed from the product.

Body: `ProductParameter.Models.Write.ProductParameterValueBatch`

Returns: `BaseEnvelope`

## PUT Product/Parameter/Values

Updates multiple product parameter values. Any existing product parameter values not supplied in the request will remain on the product.

Body: `ProductParameter.Models.Write.ProductParameterValueBatch`

Returns: `BaseEnvelope`

## PATCH Product/Parameter/Values/Remove

This endpoint removes the association between specified products and their parameters. The request accepts an array of productId and parameterId pairs, and the corresponding parameter assignments will be completely removed from the products.

Body: `ProductParameter.Models.Write.ProductParameterAssignmentBatch`

Returns: `BaseEnvelope`

## PUT Product/PurchasePrice

Update product purchase price for multiple products. Maximum 10000 products can be updated in one call.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.PurchasePriceBatchItem[]`

Returns: `Product.Models.PurchasePriceEnvelope`

## POST Product/Query

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| include | query | string |  | Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns, LowestPrice, Meta |

Body: `Product.Models.ProductQuery`

Returns: `PagedEnvelope-List-Product.Models.Read.Product`

## POST Product/Query/{page}

The batch id is mandatory when fetching any page other than the first page. If no batch id is provided for the first page, then a new batch is created. Batch id and pagination information can be found in the response.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | The page to fetch. To start a new batched query it is mandatory to send in page=1. |
| include | query | string |  | Set to empty string to only include basic product data or null to not include any product data. Valid options: Names, ShortTexts, LongTexts, TechTexts, Items, Prices, Categories, Parameters, Variants, Markets, Images, Feeds, Urls, ShippingFees, RelatedProducts, DiscountCampaigns, LowestPrice, Meta |

Body: `Product.Models.ProductQuery`

Returns: `PagedEnvelope-List-Product.Models.Read.Product`

## GET Product/RelationTypes

Gets a list of product relation types

Returns: `Envelope-List-Product.Models.Read.RelationType`

## POST Product/RelationTypes

Creates a product relation type

Body: `Product.Models.Write.RelationType`

Returns: `Envelope-Int`

## DELETE Product/RelationTypes/{id}

Deletes a product relation type

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Returns: `BaseEnvelope`

## GET Product/RelationTypes/{id}

Gets a product relation type

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Returns: `Envelope-Product.Models.Read.RelationType`

## PUT Product/RelationTypes/{id}

Updates a product relation type

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| id | path | integer (int32) | yes |  |

Body: `Product.Models.Write.RelationType`

Returns: `BaseEnvelope`

## PUT Product/SortOrder

Update product sort orders for multiple products. Maximum 10000 products can be updated in one call.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.SortOrderBatchItem[]`

Returns: `Product.Models.SortOrderEnvelope`

## PUT Product/Stock

Update stock values for multiple product items.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productItemIdType | query | enum(0, 1, 2, 3, 4) |  | The type of product item id supplied. 0 = Internal. Internal product item id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product item id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. 4 = ExternalId. External product item id set by customer. Eg: 10001. |

Body: `Product.Models.Write.ProductItemStock[]`

Returns: `Product.Models.StockEnvelope`

## POST Product/Stock/Query

Body: `integer (int32)[]`

Returns: `Envelope-List-Product.Models.Read.ProductItemStock`

## Schemas

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
| Meta | Product.Models.ProductMeta |  |  |
| BrandId | integer (int32) |  | The brand of the product. |
| MaxDiscountPercentage | integer (int32) |  | Maximum discount percentage for the product. |
| SupplierId | integer (int32) |  | The supplier id of the product. |
| Items | Product.Models.Write.ProductItem[] |  | The items belonging to the product. |
| CategoryIds | integer (int32)[] |  | The category ids the product belongs to. The first category id will be the main category. A product must belong to at least one category to be sellable. |
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

### Envelope-Product.Models.Read.Product

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.Product |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.ProductCategory

| Field | Type | Required | Description |
|---|---|---|---|
| CategoryId | integer (int32) |  | The id of the category. |

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

### Envelope-Product.Models.Read.ProductItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.ProductItem |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-ProductParameter.Models.Read.ProductParameterValue

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | ProductParameter.Models.Read.ProductParameterValue |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### ProductParameter.Models.Write.ProductParameterValueItem

| Field | Type | Required | Description |
|---|---|---|---|
| Value | string |  | The identifying value of the parameter. Although always presented as a string, the data within Value must validate against the ProductParameterType of the parameter: String = Any string. Float = Any floating point number. DateTime = Any date. Multi = Any predefined value id from the predefined set of values for this parameter. Single = Any predefined value id from the predefined set of values for this parameter. Headline = Any string. Tags = Any string, as part of a pipe-separated list. A string containing the pipe (\|) character is not allowed. |
| LocalizedDescriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the parameter. Only used for parameter types String or Headline. |

### Product.Models.Write.RelatedProduct

A related product.

| Field | Type | Required | Description |
|---|---|---|---|
| RelatedProductId | string |  | The unique identifier for the related product. |
| RelationTypeId | integer (int32) |  | The product relation type id. |

### Product.Models.RelatedProductEnvelope

The response of a related products request.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | Product.Models.Write.RelatedProduct[] |  | Supplied relatedProducts that failed validation. |
| NotFound | Product.Models.Write.RelatedProduct[] |  | Supplied relatedProducts that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of related product updates resulting from the request. |

### Envelope-List-Product.Models.Read.Feed

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.Feed[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.ProductItemEnvelope

An envelope for the result of and action taken on a product item.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Item | Product.Models.Read.ProductItem |  |  |

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

### Envelope-Product.Models.Read.ProductItemResult

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.ProductItemResult |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-Product.Models.Read.ProductItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.ProductItem[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.MonitorSku

| Field | Type | Required | Description |
|---|---|---|---|
| SiteId | integer (int32) |  |  |
| LanguageCode | string |  |  |
| Email | string |  |  |
| SkuId | integer (int32) |  |  |

### ProductParameter.Models.Write.ProductParameterValueBatch

| Field | Type | Required | Description |
|---|---|---|---|
| productParameterValues | ProductParameter.Models.Write.ProductParameterValue[] |  |  |

### ProductParameter.Models.Write.ProductParameterAssignmentBatch

A batch of product parameter assignments.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductParameterAssignments | ProductParameter.Models.Write.ProductParameterAssignment[] |  | The product parameter assignments to be deleted. |

### Product.Models.Write.PurchasePriceBatchItem

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string |  | A value to uniquely identity a single product. This value can represent different fields, depending on configuration. |
| PurchasePrice | number (double) |  | The purchase price in the currency defined in PurchasePriceCurrency. |
| PurchasePriceCurrency | string |  | The 3-letter ISO 4217 currency code for the amount given in PurchasePrice. |

### Product.Models.PurchasePriceEnvelope

The response of a product purchase price batch request-

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | Product.Models.Write.PurchasePriceBatchItem[] |  | Supplied purchase price batch items that failed validation. |
| NotFound | Product.Models.Write.PurchasePriceBatchItem[] |  | Supplied purchase batch items that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of purchase price updates resulting from the request. |

### Product.Models.ProductQuery

A product query. All fields are optional.

| Field | Type | Required | Description |
|---|---|---|---|
| UpdatedAfter | string (date-time) |  | Limits query to products updated after the specified date. |
| CreatedAfter | string (date-time) |  | Limits query to products created after the specified date. |
| CreatedBefore | string (date-time) |  | Limits query to products created before the specified date. |
| ProductIds | integer (int32)[] |  | Limits query to only include the supplied product ids. |
| CategoryIds | integer (int32)[] |  | Limits query to only include products assigned to the supplied category ids. |
| BrandIds | integer (int32)[] |  | Limits query to only include products assigned to the supplied brand ids. |
| SupplierIds | integer (int32)[] |  | Limits query to only include products assigned to the supplied supplier ids. |
| ArticleNumbers | string[] |  | Limits query to only include products with supplied article numbers. |
| OnlySellable | boolean |  | Limits query to only include products that are available for purchase. |
| OnlyInStock | boolean |  | Limits query to only include products that are in stock. |
| FeedId | integer (int32) |  | Limits query to only include products contained in the specified feed. |
| BatchId | string (uuid) |  | Used to fetch products where the result set is split into batches. |

### PagedEnvelope-List-Product.Models.Read.Product

| Field | Type | Required | Description |
|---|---|---|---|
| PageResult | PageResult |  |  |
| Resource | Product.Models.Read.Product[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-Product.Models.Read.RelationType

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.RelationType[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.Write.RelationType

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  |  |
| Order | integer (int32) |  |  |

### Envelope-Int

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | integer (int32) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Product.Models.Read.RelationType

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.RelationType |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.Write.SortOrderBatchItem

Custom sort values for a product (batch).

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string |  | A value to uniquely identity a single product. This value can represent different fields, depending on configuration. |
| Custom1 | integer (int32) |  | Custom sort value 1. |
| Custom2 | integer (int32) |  | Custom sort value 2. |
| Custom3 | integer (int32) |  | Custom sort value 3. |
| Custom4 | integer (int32) |  | Custom sort value 4. |
| Custom5 | integer (int32) |  | Custom sort value 5. |

### Product.Models.SortOrderEnvelope

The response of a product sort order batch request-

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | Product.Models.Write.SortOrderBatchItem[] |  | Supplied sort order batch items that failed validation. |
| NotFound | Product.Models.Write.SortOrderBatchItem[] |  | Supplied sort order batch items that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of sort order updates resulting from the request. |

### Product.Models.Write.ProductItemStock

A stock value for a product item.

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string |  | A value to uniquely identity a single product item. This value can represent different fields, depending on configuration. |
| Stock | integer (int32) |  | The stock value. |
| StockSellable | integer (int32) |  | The sellable stock value. This value is read only. |
| StockType | enum(0, 1, 2) |  | The type of stock to be updated. 0 = Available. Sets the actual count of items in warehouse. 1 = Oversellable. Sets the count for items that are available for purchase but not in physical stock. 2 = Static. Sets the count for items that have a static count that is always available (eg. digital gift cards). When set, the stock count should be considered the max amount a customer can put in cart for the current item. |

### Product.Models.StockEnvelope

The response of a Stock request.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | Product.Models.Write.ProductItemStock[] |  | Supplied productItemStocks that failed validation. |
| NotFound | Product.Models.Write.ProductItemStock[] |  | Supplied productItemStocks that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of stock updates resulting from the request. |

### Envelope-List-Product.Models.Read.ProductItemStock

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.ProductItemStock[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Shared.Models.LocalizableContent

A piece of localized content.

| Field | Type | Required | Description |
|---|---|---|---|
| LanguageCode | string |  | The 2-letter ISO 639-1 language code for this locale. |
| Content | string |  | The localized content. |

### Product.Models.ProductMeta

Meta information for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized meta descriptions of the product. |
| Keywords | Shared.Models.LocalizableContent[] |  | The localized meta keywords of the product. |
| Titles | Shared.Models.LocalizableContent[] |  | The localized meta titles of the product. |

### ProductParameter.Models.Write.ProductParameterValue

A parameter value for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The product id of the parameter. This value can be omitted if the value is part of a product request. |
| ParameterId | integer (int32) |  | The unique identifier of the parameter that this value belongs to. |
| Value | string |  | The identifying value of the parameter. Although always presented as a string, the data within Value must validate against the ProductParameterType of the parameter: String = Any string. Float = Any floating point number. DateTime = Any date. Multi = Any predefined value id from the predefined set of values for this parameter. Single = Any predefined value id from the predefined set of values for this parameter. Headline = Any string. Tags = Any string, as part of a pipe-separated list. A string containing the pipe (\|) character is not allowed. |
| LocalizedDescriptions | Shared.Models.LocalizableContent[] |  | The localized descriptions of the parameter. Only used for parameter types String or Headline. |

### Variant.Models.Write.Variant

A variant of a product.

| Field | Type | Required | Description |
|---|---|---|---|
| Label | string |  | The name of the variant, eg "Color", "Weight" etc. |
| Value | string |  | The value of this variant, eg "Blue", "250g" etc. |

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
| Meta | Product.Models.ProductMeta |  |  |
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

### Product.Models.Read.Feed

A product feed.

| Field | Type | Required | Description |
|---|---|---|---|
| FeedId | integer (int32) |  | The feed id. |
| Name | string |  | The feed name. |
| Url | string |  | The url to the feed. |
| Layout | string |  | The name of the feed layout. |
| Market | integer (int32) |  | The market of the feed. |
| Language | string |  | The language code of the feed. |
| DefaultCurrency | string |  | The default currency for the market. |
| DefaultCountry | string |  | The default country for the market. |

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

### Product.Models.Read.ProductItemResult

| Field | Type | Required | Description |
|---|---|---|---|
| UpdateCount | integer (int32) |  |  |

### ProductParameter.Models.Write.ProductParameterAssignment

A parameter assignment for a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The product id of the parameter. |
| ParameterId | integer (int32) |  | The unique identifier of the parameter that is assigned to the product |

### PageResult

Contains pagination information for paged operations, i.e. PageSize and PageCount.

| Field | Type | Required | Description |
|---|---|---|---|
| BatchId | string (uuid) |  | The id of the batch operation. If this property has a value for the first fetched page it has to be passed as a parameter for all subsequent requests. |
| Page | integer (int32) |  | The current page |
| RowCount | integer (int32) |  | Total number of rows |
| PageCount | integer (int32) |  | Total number of pages |
| PageSize | integer (int32) |  | Page size |
| HasMoreRows | boolean |  | True if there is more content to fetch. |

### Product.Models.Read.RelationType

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  |  |
| Name | string |  |  |
| Order | integer (int32) |  |  |

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

### Variant.Models.Read.Variant

A variant of a product.

| Field | Type | Required | Description |
|---|---|---|---|
| ProductId | integer (int32) |  | The id of the product this variant information belongs to. |
| GroupId | integer (int32) |  | The id of the group this variant belongs to. |
| Label | string |  | The name of the variant information, eg "Weight", "Length" etc. |
| Value | string |  | The value of the variant information, eg "250g", "89cm" etc. |

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

### Category.Models.CategoryMeta

Meta information for a category.

| Field | Type | Required | Description |
|---|---|---|---|
| Descriptions | Shared.Models.LocalizableContent[] |  | The localized meta descriptions of the category. |
| Keywords | Shared.Models.LocalizableContent[] |  | The localized meta keywords of the category. |
| Titles | Shared.Models.LocalizableContent[] |  | The localized meta titles of the category. |

