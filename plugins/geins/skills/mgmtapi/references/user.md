# User

Generated on 2026-09-24 from the Geins Management API spec. Do not edit; regenerate with `node scripts/sync-api-spec.js`.

Paths are relative to the base URL the scripts already hold, so pass them to `-Path` as written.

| Method | Path | Summary |
|---|---|---|
| GET | `BalanceType/List` | Get user balance types |
| POST | `User` | Create user profile |
| DELETE | `User/{email}` | Delete user profile (email) |
| GET | `User/{email}` | Get user profile (email) |
| DELETE | `User/{userId}` | Delete user profile (id) |
| GET | `User/{userId}` | Get user profile (id) |
| PATCH | `User/{userId}` | Update user profile |
| POST | `User/{userId}/Balance` | Add user balance |
| GET | `User/{userId}/Balance/{currency}` | Get user balance |
| GET | `User/{userId}/BalanceTransaction/List/{currency}` | Get user balance transactions |
| POST | `User/Query/{page}` | Query user profiles |

## GET BalanceType/List

Gets all available balance types.

Returns: `Envelope-List-User.Models.Read.BalanceType`

## POST User

Body: `User.Models.Write.UserProfile`

Returns: `Envelope-User.Models.Read.UserProfile`

## DELETE User/{email}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| email | path | string | yes | Email address |

Returns: `BaseEnvelope`

## GET User/{email}

Gets a specific user profile via email.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| email | path | string | yes | The user email. |

Returns: `Envelope-User.Models.Read.SingleUserProfile`

## DELETE User/{userId}

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes | The user id |

Returns: `BaseEnvelope`

## GET User/{userId}

Gets a specific user profile via user id.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes | The user id. |

Returns: `Envelope-User.Models.Read.SingleUserProfile`

## PATCH User/{userId}

Updates a user profile. Any fields not specified in the request or with null value will be left unchanged.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes | The user id |

Body: `User.Models.Write.UserProfile`

Returns: `BaseEnvelope`

## POST User/{userId}/Balance

Adds a balance transaction to a specific user.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes |  |

Body: `User.Models.Write.BalanceTransaction`

Returns: `BaseEnvelope`

## GET User/{userId}/Balance/{currency}

Gets the balance for a specific user.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes |  |
| currency | path | string | yes |  |

Returns: `Envelope-User.Models.Read.Balance`

## GET User/{userId}/BalanceTransaction/List/{currency}

Gets all balance transactions for a specific user.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| userId | path | integer (int32) | yes |  |
| currency | path | string | yes |  |

Returns: `Envelope-List-User.Models.Read.BalanceTransaction`

## POST User/Query/{page}

Queries user profiles and stores the result in a batch. Results are fetched from this batch one page at a time via subsequent requests. BatchId is mandatory when fetching any page other than the first page. If no BatchId is provided for the first page, a new batch is created and the id for that batch can be found in the response.

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| page | path | integer (int32) | yes | The page to fetch. Omitting the page number will return the first page. |

Body: `User.Models.UserProfileQuery`

Returns: `PagedEnvelope-List-User.Models.Read.UserProfile`

## Schemas

### Envelope-List-User.Models.Read.BalanceType

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | User.Models.Read.BalanceType[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### User.Models.Write.UserProfile

| Field | Type | Required | Description |
|---|---|---|---|
| SiteId | integer (int32) |  | The ID of the site associated with the user. |
| Email | string |  | The email address of the user. |
| FirstName | string |  | The first name of the user. |
| LastName | string |  | The last name of the user. |
| PhoneNr | string |  | The phone number of the user. |
| MobilePhoneNr | string |  | The mobile phone number of the user. |
| Company | string |  | The company the user is associated with. |
| UserTypeId | integer (int32) |  | UserTypeId of the user. 1 = Private, 2 = Company. |
| MemberId | integer (int32) |  | The member ID of the user. Obsolote. Use CustomerGroupId instead. |
| CustomerGroupId | integer (int32) |  | The Customer Group Id of the user. |
| Address | string |  | The address of the user. |
| Address2 | string |  | The second line of the user's address. |
| Address3 | string |  | The third line of the user's address. |
| DoorCode | string |  | The door code for the user's address. |
| PersonalId | string |  | The personal ID of the user. |
| Birthyear | string |  | The birth year of the user. |
| Zip | string |  | The zip code of the user's address. |
| City | string |  | The city of the user's address. |
| CareOf | string |  | The care of (c/o) address of the user. |
| Country | string |  | The country of the user's address. Can be a country code or a country name. |
| State | string |  | The state of the user's address. |
| CountryId | integer (int32) |  | The country ID of the user's address. |
| GenderType | enum(0, 1, 2) |  | The gender of the user. Enum type with the following values: Unspecified=0, Female=1, Male=2. 0 = Unspecified 1 = Female 2 = Male |
| Password | string |  | The password of the user. |
| Newsletter | boolean |  | Decides whether the user should be subscribed to the newsletter. |
| MetaData | string |  | Free-text field for any additional data that should be stored with the user. |

### Envelope-User.Models.Read.UserProfile

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | User.Models.Read.UserProfile |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### BaseEnvelope

A base envelope for the result of an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-User.Models.Read.SingleUserProfile

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | User.Models.Read.SingleUserProfile |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### User.Models.Write.BalanceTransaction

| Field | Type | Required | Description |
|---|---|---|---|
| BalanceType | string |  | The type of balance. See the separate endpoint for available balance types. Required. |
| Currency | string |  | The currency of this balance transaction. 3-letter ISO currency code. Optional. Will default to the users default currency if not specified. |
| ExternalId | integer (int32) |  | An optional external id of the transaction. |
| Text | string |  | Additional optional information about the transaction. |
| Amount | number (double) |  | The amount to add to balance. Can be negative. Required. |

### Envelope-User.Models.Read.Balance

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | User.Models.Read.Balance |  |  |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### Envelope-List-User.Models.Read.BalanceTransaction

An envelope for the result and resource returned from an action.

| Field | Type | Required | Description |
|---|---|---|---|
| Resource | User.Models.Read.BalanceTransaction[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### User.Models.UserProfileQuery

A user query.

| Field | Type | Required | Description |
|---|---|---|---|
| CreatedBefore | string (date-time) |  | Limits query to users created before the specified date. |
| CreatedAfter | string (date-time) |  | Limits query to users created after the specified date. |
| UpdatedAfter | string (date-time) |  | Limits query to users updated after the specified date. |
| IncludeInactive | boolean |  | Set to true to include inactive users in the query. |
| BatchId | string (uuid) |  | Used to fetch products where the result set is split into batches. |
| UserId | integer (int32) |  |  |
| Email | string |  |  |

### PagedEnvelope-List-User.Models.Read.UserProfile

| Field | Type | Required | Description |
|---|---|---|---|
| PageResult | PageResult |  |  |
| Resource | User.Models.Read.UserProfile[] |  | The resource on which the action was taken. |
| Message | string |  | A status message for the action taken. |
| Details | string[] |  | Any validation messages for the data on the current action. |

### User.Models.Read.BalanceType

| Field | Type | Required | Description |
|---|---|---|---|
| Name | string |  |  |

### User.Models.Read.UserProfile

| Field | Type | Required | Description |
|---|---|---|---|
| UserId | integer (int32) |  | The ID of the user. |
| SiteId | integer (int32) |  | The ID of the site associated with the user. |
| Email | string |  | The email address of the user. |
| FirstName | string |  | The first name of the user. |
| LastName | string |  | The last name of the user. |
| PhoneNr | string |  | The phone number of the user. |
| MobilePhoneNr | string |  | The mobile phone number of the user. |
| Company | string |  | The company the user is associated with. |
| Address | string |  | The address of the user. |
| Address2 | string |  | The second line of the user's address. |
| Address3 | string |  | The third line of the user's address. |
| DoorCode | string |  | The door code for the user's address. |
| PersonalId | string |  | The personal ID of the user. |
| Birthyear | string |  | The birth year of the user. |
| Zip | string |  | The zip code of the user's address. |
| City | string |  | The city of the user's address. |
| CareOf | string |  | The care of (c/o) address of the user. |
| Country | string |  | The country of the user's address. |
| State | string |  | The state of the user's address. |
| CustomerGroupId | integer (int32) |  | The id of the customer group that the customer belongs to. |
| CustomerGroupName | string |  | The name of the customer group that the customer belongs to. |
| MemberId | integer (int32) |  | The member ID of the user. Obsolete. Use CustomerGroupId instead. |
| MemberType | string |  | The member type of the user. Obsolete. Use CustomerGroupName instead. |
| CountryId | integer (int32) |  | The country ID of the user's address. |
| UserTypeId | integer (int32) |  | UserTypeId of the user. 1 = Private, 2 = Company. |
| GenderType | enum(0, 1, 2) |  | The gender of the user. Enum type with the following values: Unspecified=0, Female=1, Male=2. 0 = Unspecified 1 = Female 2 = Male |
| MemberDiscount | integer (int32) |  | The member discount of the user. |
| Newsletter | boolean |  | Decides whether the user should be subscribed to the newsletter. |
| Blacklisted | boolean |  | Indicates whether the user is blacklisted. |
| Active | boolean |  | Indicates whether the user is active. |
| CreatedOn | string (date-time) |  | The date and time when the user was created. |
| UpdatedOn | string (date-time) |  | The date and time when the user was last updated. |
| MetaData | string |  | Metadata associated with the user. |
| BlacklistedOn | string (date-time) |  | The date and time when the user was blacklisted. |
| BlacklistReason | string |  | The reason for blacklisting the user. |

### User.Models.Read.SingleUserProfile

| Field | Type | Required | Description |
|---|---|---|---|
| AvailableMarkets | User.Models.Read.UserMarket[] |  | The list of markets available to the user. |
| UserId | integer (int32) |  | The ID of the user. |
| SiteId | integer (int32) |  | The ID of the site associated with the user. |
| Email | string |  | The email address of the user. |
| FirstName | string |  | The first name of the user. |
| LastName | string |  | The last name of the user. |
| PhoneNr | string |  | The phone number of the user. |
| MobilePhoneNr | string |  | The mobile phone number of the user. |
| Company | string |  | The company the user is associated with. |
| Address | string |  | The address of the user. |
| Address2 | string |  | The second line of the user's address. |
| Address3 | string |  | The third line of the user's address. |
| DoorCode | string |  | The door code for the user's address. |
| PersonalId | string |  | The personal ID of the user. |
| Birthyear | string |  | The birth year of the user. |
| Zip | string |  | The zip code of the user's address. |
| City | string |  | The city of the user's address. |
| CareOf | string |  | The care of (c/o) address of the user. |
| Country | string |  | The country of the user's address. |
| State | string |  | The state of the user's address. |
| CustomerGroupId | integer (int32) |  | The id of the customer group that the customer belongs to. |
| CustomerGroupName | string |  | The name of the customer group that the customer belongs to. |
| MemberId | integer (int32) |  | The member ID of the user. Obsolete. Use CustomerGroupId instead. |
| MemberType | string |  | The member type of the user. Obsolete. Use CustomerGroupName instead. |
| CountryId | integer (int32) |  | The country ID of the user's address. |
| UserTypeId | integer (int32) |  | UserTypeId of the user. 1 = Private, 2 = Company. |
| GenderType | enum(0, 1, 2) |  | The gender of the user. Enum type with the following values: Unspecified=0, Female=1, Male=2. 0 = Unspecified 1 = Female 2 = Male |
| MemberDiscount | integer (int32) |  | The member discount of the user. |
| Newsletter | boolean |  | Decides whether the user should be subscribed to the newsletter. |
| Blacklisted | boolean |  | Indicates whether the user is blacklisted. |
| Active | boolean |  | Indicates whether the user is active. |
| CreatedOn | string (date-time) |  | The date and time when the user was created. |
| UpdatedOn | string (date-time) |  | The date and time when the user was last updated. |
| MetaData | string |  | Metadata associated with the user. |
| BlacklistedOn | string (date-time) |  | The date and time when the user was blacklisted. |
| BlacklistReason | string |  | The reason for blacklisting the user. |

### User.Models.Read.Balance

| Field | Type | Required | Description |
|---|---|---|---|
| CurrentBalance | number (double) |  |  |
| Currency | string |  |  |

### User.Models.Read.BalanceTransaction

| Field | Type | Required | Description |
|---|---|---|---|
| BalanceType | string |  | The type of balance. |
| Currency | string |  | The currency of this balance transaction. 3-letter ISO currency code. |
| ExternalId | integer (int32) |  | An optional external id of the transaction. |
| Text | string |  | Additional optional information about the transaction. |
| Amount | number (double) |  | The transaction amount. |
| CreatedOn | string (date-time) |  | The date the transaction was created. |

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

### User.Models.Read.UserMarket

| Field | Type | Required | Description |
|---|---|---|---|
| Id | integer (int32) |  | Market id. |
| ChannelId | string |  | Channel id. Format: {Id}\|{MarketTopDomain} |
| Countries | User.Models.Read.UserCountry[] |  |  |

### User.Models.Read.UserCountry

| Field | Type | Required | Description |
|---|---|---|---|
| CurrencyId | integer (int32) |  | The currency ID. |
| Currency | string |  | Currency code. |
| CountryId | integer (int32) |  | The country ID. |
| Country | string |  | The country code. |

