"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

// Opens the phone's share sheet where the Web Share API exists; elsewhere copies the link.
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState<{ text: string; error?: boolean }>({ text: "" });
  const show = (text: string, error = false) => {
    setStatus({ text, error });
    window.setTimeout(() => setStatus({ text: "" }), error ? 4000 : 2000);
  };
  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      trackEvent("share_clicked", { method: "copy_link" });
      show("Link copied");
    } catch {
      show("Couldn’t share. Copy the address bar instead.", true);
    }
  };
  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    if (!navigator.share) return copy(url);
    try {
      await navigator.share({ title, url });
      trackEvent("share_clicked", { method: "share_sheet" });
    } catch (error) {
      // Closing the sheet is not an error; a refused sheet falls back to copying the link.
      if (!(error instanceof DOMException && error.name === "AbortError")) await copy(url);
    }
  };
  return <span className="share">
    <button type="button" className="share-button" onClick={share}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>
      Share
    </button>
    <span className="share__status" aria-live="polite" data-error={status.error ? "" : undefined}>{status.text}</span>
  </span>;
}
