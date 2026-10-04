- **`POST Brand` needs an `ExternalId`**, though the spec does not mark it required. Without one the
  API answers 500 `A database error occured.` Use a slug of the name when the user gives none.
- **`PUT Brand/{id}` requires `Name`, so treat it as a full replace**: read the brand, change what you
  need, and send the whole body back. *(unverified)*
