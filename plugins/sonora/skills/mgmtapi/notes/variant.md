- **A product belongs to at most one variant group.** *(unverified)*
- **The group's main product is the first one attached, and cannot be changed afterwards**; there is
  no writable main product field. Attach the intended main product first. Deleting and recreating a
  group gives it a new id and a new main product. *(unverified)*
- **Variant labels must exist before products use them.** Read `Variant/Labels` and create missing
  ones with `POST Variant/Label` first. *(unverified)*
- **`include=Variants` returns the whole group's entries on every member.** Filter by `ProductId` to
  get one product's own dimension values. *(unverified)*
