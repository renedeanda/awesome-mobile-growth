"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { BrandMark } from "./BrandMark";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Mode = "hidden" | "prompt" | "ios";

const standalone = () => matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Chromium fires beforeinstallprompt once, early, so the header listens for the whole visit, not just while the menu is open. */
export function useInstallPrompt() {
  const [event, setEvent] = useState<InstallPrompt | null>(null);
  const [mode, setMode] = useState<Mode>("hidden");
  useEffect(() => {
    if (standalone()) return;
    if (isIOS()) setMode("ios");
    const onPrompt = (prompt: Event) => { prompt.preventDefault(); setEvent(prompt as InstallPrompt); setMode("prompt"); };
    const onInstalled = () => { setEvent(null); setMode("hidden"); };
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);
    return () => { removeEventListener("beforeinstallprompt", onPrompt); removeEventListener("appinstalled", onInstalled); };
  }, []);
  const install = async () => {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    trackEvent("install_prompt", { outcome });
    setEvent(null);
    if (outcome === "accepted") setMode("hidden");
  };
  return { mode, install };
}

export function InstallRow({ mode, install }: ReturnType<typeof useInstallPrompt>) {
  if (mode === "hidden") return null;
  return <div className="menu-install">
    <BrandMark size={44}/>
    <div>
      <p className="menu-install__title">Add to Home Screen</p>
      {mode === "ios"
        ? <p className="menu-install__hint">Tap <ShareGlyph/> Share, then <strong>Add to Home Screen</strong>. It opens full screen and keeps working offline.</p>
        : <p className="menu-install__hint">Opens full screen, with shortcuts to the Workbench and checklist, and keeps working offline.</p>}
    </div>
    {mode === "prompt" && <button type="button" className="button" onClick={install}>Install</button>}
  </div>;
}

function ShareGlyph() {
  return <svg className="menu-install__glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>;
}
