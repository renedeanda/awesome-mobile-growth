# Portable working brief

Use a versioned JSON object when exchanging a project brief:

```json
{
  "version": 2,
  "updatedAt": "2026-10-12T00:00:00.000Z",
  "brief": {
    "product": "",
    "audience": "",
    "job": "",
    "promise": "",
    "proof": "",
    "exclusions": ""
  },
  "fields": {},
  "keywordMap": "",
  "screenshotPlan": "",
  "experimentLog": "",
  "launchRetro": ""
}
```

Keep unknown fields when possible. Do not add credentials, private analytics, customer data, or store-console tokens.
