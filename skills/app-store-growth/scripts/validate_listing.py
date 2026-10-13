#!/usr/bin/env python3
"""Validate common app-store text limits from a local JSON file. No network access."""
import json, sys
from pathlib import Path

LIMITS = {"appleName": 30, "appleSubtitle": 30, "applePromotional": 170, "appleKeywords": 100, "appleDescription": 4000, "appleWhatsNew": 4000, "googleName": 30, "googleShort": 80, "googleFull": 4000}

def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: validate_listing.py listing.json")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    fields = data.get("fields", data)
    failed = False
    for key, limit in LIMITS.items():
        value = fields.get(key, "")
        size = len(value.encode("utf-8")) if key == "appleKeywords" else len(value)
        state = "OVER" if size > limit else "OK"
        failed = failed or size > limit
        print(f"{state:4} {key}: {size}/{limit}{' bytes' if key == 'appleKeywords' else ''}")
    keywords = [item.strip().casefold() for item in fields.get("appleKeywords", "").split(",") if item.strip()]
    repeats = sorted({item for item in keywords if keywords.count(item) > 1})
    if repeats:
        failed = True
        print("OVER appleKeywords duplicates: " + ", ".join(repeats))
    raise SystemExit(1 if failed else 0)

if __name__ == "__main__":
    main()
