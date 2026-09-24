# ProductImage

Generated on 2026-09-24 from the Geins Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| DELETE | `Product/{productId}/Image/{imageName}` | Delete product image |
| POST | `Product/{productId}/Image/{imageName}` | Add product image |
| PUT | `Product/{productId}/Image/{imageName}` | Add/update product image |
| PUT | `Product/{productId}/ImageRelation/{imageName}` | Add existing image to product |
| PUT | `Product/ImageRelation/{imageName}` | Add existing image to products (batch) |

## DELETE Product/{productId}/Image/{imageName}

Deletes an image on a product. Does not delete the physical image file from storage.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| imageName | path | string | yes | The file name of the image to delete. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Returns: `BaseEnvelope`

## POST Product/{productId}/Image/{imageName}

Uploads a new image on a product. If an image with the same file name already exists, the image will still be uploaded but with a new unique name. The image is included in the body of the request as binary data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| imageName | path | string | yes | The file name of the image that is uploaded. |
| position | query | integer (int32) |  | The relative position of the image in the list of images for the product. Will default to 1 if not set. |
| isPrimaryImage | query | boolean |  | Specifies whether this image is the primary image on the product. Will not remove the image as primary image if set to false. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `string (binary)`

Returns: `Envelope-Product.Models.Read.UploadedImage`

## PUT Product/{productId}/Image/{imageName}

Creates or updates an image on a product. If an image with the same file already exists it will be replaced. The image is included in the body of the request as binary data.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| imageName | path | string | yes | The file name of the image that is uploaded. |
| position | query | integer (int32) |  | The relative position of the image in the list of images for the product. For new images this will default to 1 if not set. Leave as null to not change the position on an existing image. |
| isPrimaryImage | query | boolean |  | Specifies whether this image is the primary image on the product. Will not remove the image as primary image if set to false. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `string (binary)`

Returns: `Envelope-Product.Models.Read.UploadedImage`

## PUT Product/{productId}/ImageRelation/{imageName}

Adds an existing image file name to a product without uploading a new image.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| productId | path | string | yes | The id of the product to update. |
| imageName | path | string | yes | The name of the existing image to set on the product. |
| position | query | integer (int32) |  | The relative position of the image in the list of images for the product. Will default to 1 if not set. |
| isPrimaryImage | query | boolean |  | Specifies whether {imageName} should be set as the primary image of the product. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied in {productId}. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Returns: `Envelope-Product.Models.Read.UploadedImage`

## PUT Product/ImageRelation/{imageName}

Adds an existing image file name to multiple products without uploading a new image. Maximum 10000 products can be updated in one call.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| imageName | path | string | yes | The name of the existing image to set on the products. |
| position | query | integer (int32) |  | The relative position of the image in the list of images for the products. Will default to 1 if not set. |
| isPrimaryImage | query | boolean |  | Specifies whether {imageName} should be set as the primary image of the products. |
| productIdType | query | enum(0, 1, 2, 3) |  | The type of product id supplied in the request body. 0 = Internal. Internal product id set by Geins. Eg: 10001. 1 = ArticleNumber. Article number set by customer. Eg: ABC123. 2 = MarketPrefixedInternal. Internal product id set by Geins, prefixed with market. Eg: SE10001. 3 = MarketPrefixedArticleNumber. Article number set by customer, prefixed with market. Eg: SEABC123. |

Body: `Product.Models.Write.ImageRelationBatchItem[]`

Returns: `Product.Models.ImageRelationBatchEnvelope`

## Schemas

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Product.Models.Read.UploadedImage

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Product.Models.Read.UploadedImage |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Product.Models.Write.ImageRelationBatchItem

Existing image relation values for a product (batch).

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string |  | A value to uniquely identity a single product. This value can represent different fields, depending on configuration. |

### Product.Models.ImageRelationBatchEnvelope

The response of a product image relation batch request.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | Information about the outcome of the request. |
| Invalid | Product.Models.Write.ImageRelationBatchItem[] |  | Supplied image relation batch items that failed validation. |
| NotFound | Product.Models.Write.ImageRelationBatchItem[] |  | Supplied image relation batch items that were technically valid, but couldn't be found. |
| UpdateCount | integer (int32) |  | Number of image relation updates resulting from the request. |

### Product.Models.Read.UploadedImage

| Field | Type | Required | Description |
|---|---|---|---|
| FileName | string |  |  |

