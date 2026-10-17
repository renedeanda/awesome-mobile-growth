"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

// Opens the phone's share sheet where the Web Share API exists; elsewhere copies the link.
export function ShareButton({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState("");
  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        trackEvent("share_clicked", { method: "share_sheet" });
        return;
      }
      await navigator.clipboard.writeText(url);
      trackEvent("share_clicked", { method: "copy_link" });
      setStatus("Link copied");
      window.setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Couldn’t share. Copy the address bar instead.");
    }
  };
  return <span className="share">
    <button type="button" className="share-button" onClick={share}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>
      Share
    </button>
    <span className="share__status" aria-live="polite">{status}</span>
  </span>;
}
