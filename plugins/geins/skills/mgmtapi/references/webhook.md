# Webhook

Generated on 2026-09-08 from the Geins Management API spec. Do not edit; regenerate with `node scripts/geins/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| POST | `Webhook` | Create webhook |
| DELETE | `Webhook/{webhookId}` | Delete webhook |
| GET | `Webhook/{webhookId}` | Get webhook |
| PUT | `Webhook/{webhookId}` | Update webhook |
| GET | `Webhook/List` | List webhooks |

## POST Webhook

Creates a new webhook with the provided information.

Body: `Webhook.Models.RestWebhook`

Returns: `Envelope-Nullable-Guid`

## DELETE Webhook/{webhookId}

Deletes a specific webhook by its unique identifier.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| webhookId | path | string (uuid) | yes | The unique identifier of the webhook to be deleted. |

Returns: `BaseEnvelope`

## GET Webhook/{webhookId}

Retrieves a specific webhook by its unique identifier.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| webhookId | path | string (uuid) | yes | The unique identifier of the webhook. |

Returns: `Envelope-Geins.WebhookItem`

## PUT Webhook/{webhookId}

Updates the information of an existing webhook.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| webhookId | path | string (uuid) | yes | The unique identifier of the webhook to be deleted. |

Body: `Webhook.Models.RestWebhook`

Returns: `Envelope-Nullable-System.Boolean`

## GET Webhook/List

Retrieves all the webhooks in the system.

Returns: `Envelope-List-Geins.WebhookItem`

## Schemas

### Webhook.Models.RestWebhook

| Field | Type | Required | Description |
|---|---|---|---|
| Entity | enum(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10) |  | Type of entity. 0 = NOT_SET 1 = Brand 2 = Capture 3 = Category 4 = Customer 5 = Order 6 = PageWidget 7 = Product 8 = Refund 9 = Supplier 10 = ProductMonitor |
| Name | string |  | Webhook Name |
| Description | string |  | Webhook Description |
| Actions | string |  | Comma separated list of actions to listen for. Possible actions per entity are: - **Product, Brand, Category, Supplier** - `create`, `update`, `delete` - **Order** - `create`, `update`, `cancel`, `activate`, `lock`, `complete`, `cancelrow`, `return` - **Capture, Refund** - `create` - **PageWidget** - `update`, `delete` - **Customer** - `create`, `update`, `delete`, `passwordreset`, `obfuscate` - **ProductMonitor** - `create`, `notify` |
| Method | string |  | Http Method to use |
| Url | string |  | Url to send the webhook to. Placeholders can be used to customize the URL. - _Always available placeholders:_ - `{{entity}}` - Product, Brand, Category, etc - `{{action}}` - create, update, delete, etc - `{{account}}` - usually the name of your webshop - `{{environment}}` - prod, dev, qa, etc - `{{id}}` - (can be a comma separated list of ids) - _Partially available placeholders:_ - `{{paymentName}}` - name of payment method. Only applicable for capture and refund - `{{channelName}}` - name of the channel (web site). Only applicable for capture, refund, productMonitor and password reset - `{{channelUrl}}` - url of the channel (web site). Only applicable for password reset - `{{resetKey}}` - key for password reset. Only applicable for password reset - `{{orderRowId}}` - id of the order row. Only applicable for order row actions - `{{returnId}}` - id of the order return. Only applicable for order action return - `{{subEntity}}` - subentity placeholder available for Entity Product and Order. For Product, possible values are: - `stockBalance` - `price` - `image` - `sortOrder` - `purchasePrice` - `variant` - `parameter` - `category` - `relation` - `item` For Order, valid values are: - `row`, `status` If the entire product or order has been updated, this placeholder will be empty. - _ProductMonitor only placeholders:_ - `{{email}}` - email address associated with the product monitor - `{{language}}` - language code for the product monitor - `{{productId}}` - id of the product - `{{productName}}` - name of the product - `{{productUrl}}` - url of the product - `{{productPrice}}` - price of the product - `{{productImage}}` - image url of the product - `{{itemId}}` - id of the monitored item - `{{itemName}}` - name of the monitored item - `{{channelName}}` - channel name specific to product monitor events **Note:** Not all placeholders are available for all combinations of entities and actions. Ensure that the placeholders you use are relevant to the webhook's entity and action. |
| Body | string |  | Body of the webhook. Placeholders can be used to customize the body. - _Always available placeholders:_ - `{{entity}}` - Product, Brand, Category, etc - `{{action}}` - create, update, delete, etc - `{{account}}` - usually the name of your webshop - `{{environment}}` - prod, dev, qa, etc - `{{id}}` - (can be a comma separated list of ids) - _Partially available placeholders:_ - `{{paymentName}}` - name of payment method. Only applicable for capture and refund - `{{channelName}}` - name of the channel (web site). Only applicable for capture, refund, productMonitor and password reset - `{{channelUrl}}` - url of the channel (web site). Only applicable for password reset - `{{resetKey}}` - key for password reset. Only applicable for password reset - `{{orderRowId}}` - id of the order row. Only applicable for order row actions - `{{returnId}}` - id of the order return. Only applicable for order action return - `{{subEntity}}` - subentity placeholder available for Entity Product and Order. For Product, possible values are: - `stockBalance` - `price` - `image` - `sortOrder` - `purchasePrice` - `variant` - `parameter` - `category` - `relation` - `item` For Order, valid values are: - `row`, `status` If the entire product or order has been updated, this placeholder will be empty. - _ProductMonitor only placeholders:_ - `{{email}}` - email address associated with the product monitor - `{{language}}` - language code - `{{productId}}` - id of the product - `{{productName}}` - name of the product - `{{productUrl}}` - url of the product - `{{productPrice}}` - price of the product - `{{productImage}}` - image url of the product - `{{itemId}}` - id of the monitored item - `{{itemName}}` - name of the monitored item **Note:** Not all placeholders are available for all combinations of entities and actions. Ensure that the placeholders you use are relevant to the webhook's entity and action. |
| Headers | string |  | Headers to send with the webhook |
| Retry | boolean |  | True if the webhook should be retried on failure. Retries are attempted up to 3 times with an interval of 10 minutes. - Each retry attempt will include a unique HTTP header called `x-Idempotency-Key` and a timestamp for when the webhook event was initiated. This key serves as an identifier for each specific webhook event and remains the same for all retry attempts of the same webhook event. - The primary purpose of the `x-Idempotency-Key` is to enable the receiving system to identify and handle duplicate webhook events, thus preventing duplicate processing of the same webhook event. - The timestamp header is called `x-timestamp`. |

### Envelope-Nullable-Guid

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | string (uuid) |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Geins.WebhookItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Geins.WebhookItem |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-Nullable-System.Boolean

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | boolean |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-Geins.WebhookItem

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | Geins.WebhookItem[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Geins.WebhookItem

A data model for webhook Registrations

| Field | Type | Required | Description |
|---|---|---|---|
| Id | string (uuid) |  | Webhook Id |
| Entity | enum(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10) |  | Type of entity. 0 = NOT_SET 1 = Brand 2 = Capture 3 = Category 4 = Customer 5 = Order 6 = PageWidget 7 = Product 8 = Refund 9 = Supplier 10 = ProductMonitor |
| Name | string |  | Webhook Name |
| Description | string |  | Webhook Description |
| Actions | string |  | Comma separated list of actions to listen for. Possible actions per entity are: - **Product, Brand, Category, Supplier** - `create`, `update`, `delete` - **Order** - `create`, `update`, `cancel`, `activate`, `lock`, `complete`, `cancelrow`, `return` - **Capture, Refund** - `create` - **PageWidget** - `update`, `delete` - **Customer** - `create`, `update`, `delete`, `passwordreset`, `obfuscate` - **ProductMonitor** - `create`, `notify` |
| Method | string |  | Http Method to use |
| Url | string |  | Url to send the webhook to. Placeholders can be used to customize the URL. - _Always available placeholders:_ - `{{entity}}` - Product, Brand, Category, etc - `{{action}}` - create, update, delete, etc - `{{account}}` - usually the name of your webshop - `{{environment}}` - prod, dev, qa, etc - `{{id}}` - (can be a comma separated list of ids) - _Partially available placeholders:_ - `{{paymentName}}` - name of payment method. Only applicable for capture and refund - `{{channelName}}` - name of the channel (web site). Only applicable for capture, refund, productMonitor and password reset - `{{channelUrl}}` - url of the channel (web site). Only applicable for password reset - `{{resetKey}}` - key for password reset. Only applicable for password reset - `{{orderRowId}}` - id of the order row. Only applicable for order row actions - `{{returnId}}` - id of the order return. Only applicable for order action return - `{{subEntity}}` - subentity placeholder available for Entity Product and Order. For Product, possible values are: - `stockBalance` - `price` - `image` - `sortOrder` - `purchasePrice` - `variant` - `parameter` - `category` - `relation` - `item` For Order, valid values are: - `row`, `status` If the entire product or order has been updated, this placeholder will be empty. - _ProductMonitor only placeholders:_ - `{{email}}` - email address associated with the product monitor - `{{language}}` - language code for the product monitor - `{{productId}}` - id of the product - `{{productName}}` - name of the product - `{{productUrl}}` - url of the product - `{{productPrice}}` - price of the product - `{{productImage}}` - image url of the product - `{{itemId}}` - id of the monitored item - `{{itemName}}` - name of the monitored item - `{{channelName}}` - channel name specific to product monitor events **Note:** Not all placeholders are available for all combinations of entities and actions. Ensure that the placeholders you use are relevant to the webhook's entity and action. |
| Body | string |  | Body of the webhook. Placeholders can be used to customize the body. - _Always available placeholders:_ - `{{entity}}` - Product, Brand, Category, etc - `{{action}}` - create, update, delete, etc - `{{account}}` - usually the name of your webshop - `{{environment}}` - prod, dev, qa, etc - `{{id}}` - (can be a comma separated list of ids) - _Partially available placeholders:_ - `{{paymentName}}` - name of payment method. Only applicable for capture and refund - `{{channelName}}` - name of the channel (web site). Only applicable for capture, refund, productMonitor and password reset - `{{channelUrl}}` - url of the channel (web site). Only applicable for password reset - `{{resetKey}}` - key for password reset. Only applicable for password reset - `{{orderRowId}}` - id of the order row. Only applicable for order row actions - `{{returnId}}` - id of the order return. Only applicable for order action return - `{{subEntity}}` - subentity placeholder available for Entity Product and Order. For Product, possible values are: - `stockBalance` - `price` - `image` - `sortOrder` - `purchasePrice` - `variant` - `parameter` - `category` - `relation` - `item` For Order, valid values are: - `row`, `status` If the entire product or order has been updated, this placeholder will be empty. - _ProductMonitor only placeholders:_ - `{{email}}` - email address associated with the product monitor - `{{language}}` - language code - `{{productId}}` - id of the product - `{{productName}}` - name of the product - `{{productUrl}}` - url of the product - `{{productPrice}}` - price of the product - `{{productImage}}` - image url of the product - `{{itemId}}` - id of the monitored item - `{{itemName}}` - name of the monitored item **Note:** Not all placeholders are available for all combinations of entities and actions. Ensure that the placeholders you use are relevant to the webhook's entity and action. |
| Headers | string |  | Headers to send with the webhook |
| Retry | boolean |  | True if the webhook should be retried on failure. Retries are attempted up to 3 times with an interval of 10 minutes. - Each retry attempt will include a unique HTTP header called `x-Idempotency-Key` and a timestamp for when the webhook event was initiated. This key serves as an identifier for each specific webhook event and remains the same for all retry attempts of the same webhook event. - The primary purpose of the `x-Idempotency-Key` is to enable the receiving system to identify and handle duplicate webhook events, thus preventing duplicate processing of the same webhook event. - The timestamp header is called `x-timestamp`. |

