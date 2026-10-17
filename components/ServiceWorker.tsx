"use client";

import { useEffect } from "react";

// Registers offline support in production builds only; development and tests run without it.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => { /* offline support is optional */ });
  }, []);
  return null;
}
