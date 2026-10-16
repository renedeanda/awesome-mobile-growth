"use client";

import { useEffect, useState } from "react";
import { localToday } from "@/lib/countdown";
import { formatDate } from "@/lib/site";

const LAST_VISIT = "amg-changes-visit.v1";
const SESSION_PREVIOUS = "amg-changes-previous.v1";

// The previous visit is captured once per browser session, so every badge on the page compares
// against the same date no matter which component reads it first. A first-ever visit shows no badges.
function previousVisit(): string | null {
  try {
    let previous = sessionStorage.getItem(SESSION_PREVIOUS);
    if (previous === null) {
      previous = localStorage.getItem(LAST_VISIT) ?? "";
      sessionStorage.setItem(SESSION_PREVIOUS, previous);
      localStorage.setItem(LAST_VISIT, localToday());
    }
    return previous || null;
  } catch {
    return null;
  }
}

function usePreviousVisit() {
  const [previous, setPrevious] = useState<string | null>(null);
  useEffect(() => setPrevious(previousVisit()), []);
  return previous;
}

export function NewBadge({ reviewed }: { reviewed: string }) {
  const previous = usePreviousVisit();
  return previous && reviewed > previous ? <span className="new-badge">New since your last visit</span> : null;
}

export function NewSinceSummary({ reviewed }: { reviewed: string[] }) {
  const previous = usePreviousVisit();
  if (!previous) return null;
  const count = reviewed.filter((date) => date > previous).length;
  return <p className="new-summary" role="status">{count ? `${count} new or updated since your last visit on ${formatDate(previous)}.` : `Nothing new since your last visit on ${formatDate(previous)}.`}</p>;
}
