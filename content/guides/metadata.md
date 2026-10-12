## Start with product truth

Before writing a field, make a short evidence inventory: who the app is for, the job it helps them do, the shipped features that prove it, and the constraints that could make a claim misleading. The listing can sharpen the truth; it cannot manufacture it.

> **Official:** Apple caps both the app name and subtitle at 30 characters, and promotional text at 170 characters. Verify these limits in App Store Connect before submission.

## Give each field one job

- **Name:** distinctive, simple, and recognizable. Do not make it carry the entire keyword strategy.
- **Subtitle:** explain a primary use or outcome in plain language.
- **Promotional text:** use a timely customer-facing message. Apple says it does not affect search ranking.
- **Description:** make the first sentence useful before the reader expands it; follow with scannable, inspectable features.
- **Keywords:** use relevant, unique comma-separated terms. Avoid competitor names, trademarks, duplicates, and irrelevant traffic bait.
- **What’s New:** describe meaningful changes in the order customers will care about them.

## Count the thing the platform counts

Apple’s keyword field is constrained by UTF-8 bytes. Non-ASCII characters can occupy more than one byte, so a visual character count can be falsely reassuring. The workbench uses `TextEncoder` to show the byte count.

## Keep implementation backstage

Public copy should say “private iCloud sync” if that is an accurate, shipped customer benefit—not “CloudKit architecture.” Internal technologies only belong in public copy when customers know the term and the capability is actually available.

## Review as a system

Read the metadata beside the screenshots and the product. If the subtitle promises calm organization but every screenshot foregrounds advanced automation, the page is telling two stories. Resolve that before polishing verbs.

### Primary sources

- [Apple: Creating your product page](https://developer.apple.com/app-store/product-page/)
- [Apple: App information reference](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information)
- [Apple: Platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information)
