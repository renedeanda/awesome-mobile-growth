"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cleanPath, sanitizedDestination, trackEvent } from "@/lib/analytics";

export function AnalyticsClient() {
  const pathname = usePathname();
  const lastPath = useRef("");
  useEffect(() => {
    const send = () => {
      const path = cleanPath(pathname);
      if (lastPath.current === path) return;
      if (trackEvent("page_view", { page_title: document.title, page_location: `${location.origin}${path}` })) lastPath.current = path;
    };
    send();
    addEventListener("amg:analytics-ready", send);
    return () => removeEventListener("amg:analytics-ready", send);
  }, [pathname]);

  useEffect(() => {
    const track = (target: EventTarget | null, button = 0) => {
      if (button !== 0 && button !== 1) return;
      const link = target instanceof Element ? target.closest("a") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const destination = sanitizedDestination(link.href, location.origin);
      if (!destination) return;
      trackEvent("outbound_clicked", { ...destination, placement: link.dataset.analyticsPlacement ?? "content" });
    };
    const click = (event: MouseEvent) => track(event.target, event.button);
    document.addEventListener("click", click);
    document.addEventListener("auxclick", click);
    return () => { document.removeEventListener("click", click); document.removeEventListener("auxclick", click); };
  }, []);
  return null;
}
