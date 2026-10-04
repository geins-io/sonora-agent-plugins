- **Image names share one namespace across the whole account.** A `PUT` with a file name that already
  exists overwrites that file for **every product that uses it**, not just this one. Use a name unique
  to the product unless replacing the shared file is the point. *(unverified)*
- **`PUT` keeps the exact name and overwrites; `POST` adds a suffix on a clash** (`6438.jpg` becomes
  `6438_1.jpg`). Take the stored name from `Resource.FileName` in the response rather than assuming it.
- **The main image is the one with the lowest `Order`**, not a primary flag. Setting
  `isPrimaryImage` on its own does not move an image into the main slot, and deleting the main image
  leaves the slot empty until another image is moved to the lowest position. There is no reorder
  endpoint: re-`PUT` the image with `position` to move it. *(unverified)*
- **`DELETE` removes the product's link to the image**, not the media file, which other products may
  share. *(unverified)*
- **`send.js` sends text bodies only**, so it cannot upload image bytes. Link an image already in the
  media library with `PUT Product/{productId}/ImageRelation/{imageName}`, and say so if a real upload
  is needed.
