## What changed in October 2026

Apple introduced an Asset Library in App Store Connect for creative assets that can appear beyond the familiar screenshot gallery. For apps running on iOS and iPadOS 27 or later, an approved image or video can appear as a product-page header. A separate landscape asset can appear in App Store search results. These placements are not a replacement for screenshots: they are an additional surface with their own crops, playback behavior, and review.

> **Official guidance:** availability, eligibility, and presentation remain Apple-controlled. Confirm the live requirements in [App Store Connect Help](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-your-app-store-assets) before delivery.

## The current delivery matrix

| Placement | Still image | Video |
| --- | --- | --- |
| Product-page header | 21:9 at 3840 × 1646, JPEG/JPG/PNG; or 16:9 at 5244 × 2950, PNG | 21:9 at 3840 × 1646, 5–30 seconds, 30 or 60 fps, MOV/M4V/MP4 |
| Search results | 3:2, minimum 1920 × 1280 and maximum 3840 × 2560, JPEG/JPG/PNG; or 16:9 at 5244 × 2950, PNG | 3:2, minimum 1920 × 1280 and maximum 3840 × 2560, 5–30 seconds, 30 or 60 fps, MOV/M4V/MP4 |

Search-result videos play muted and people cannot unmute them there; product-page videos start muted but can be unmuted. Both loop continuously. Build the idea so it works silently, then set the poster frame deliberately in Asset Library. Keep essential subjects and text away from edges so the composition survives different placements.

## Compose for three distances

First, inspect the asset as a tiny search-result interruption. Then inspect it as a wide product-page statement. Finally, inspect it full-size for artifacts, private data, and claims that become visible only up close. The best asset has one unmistakable subject, enough negative space to survive cropping, and no dependency on a paragraph of embedded text.

Do not bake a call to action, price, ranking, award, or unsupported superlative into the art. Treat every visible UI state as a product claim. If the image depicts a feature that needs an account, accessory, subscription, or recent device, make that context clear in the surrounding listing.

## Keep screenshots doing their job

Apple still allows one to ten screenshots. Screenshot files should be JPEG or PNG with no alpha channel. Use them to explain the product in sequence; use the new header or search asset to establish a memorable premise. A gorgeous hero that says nothing should not displace a screenshot that proves the app’s value.

The new iPhone Duo display class also changes capture planning. Apple says any apps or games submitted will require iPhone Duo screenshots beginning in April 2027. That is a future requirement, not a current universal upload mandate. Keep the editable source and device-safe layout ready, and use Xcode 27.1 when preparing an optimized build for the new device.

## A practical review pass

1. Write the one idea the asset must communicate without sound.
2. Storyboard a still before producing motion.
3. Keep product truth and recognizable UI central.
4. Preview the widest and tightest plausible crops.
5. Check the first and last video frames; either may become the remembered frame.
6. Remove private data, placeholder copy, status-bar accidents, and tiny legal text.
7. Validate the final upload inside App Store Connect rather than relying on an old template.

### Primary sources

- [Apple: Manage App Store assets](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-your-app-store-assets)
- [Apple: Creative asset specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications)
- [Apple: Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)
- [Apple: Upcoming requirements](https://developer.apple.com/news/upcoming-requirements/)
