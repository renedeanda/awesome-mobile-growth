"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // A light tap where the device supports it (Android); iOS Safari ignores it.
      navigator.vibrate?.(10);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return <button type="button" className="copy-button" onClick={copy} aria-live="polite" data-copied={copied ? "" : undefined}>
    {copied && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7"/></svg>}
    {copied ? "Copied" : label}
  </button>;
}
