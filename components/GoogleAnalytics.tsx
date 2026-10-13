import Script from "next/script";
import { AnalyticsClient } from "@/components/GoogleAnalyticsClient";

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || process.env.NODE_ENV !== "production" || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production")) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      window.dispatchEvent(new Event('amg:analytics-ready'));
    `}</Script>
    <AnalyticsClient />
  </>;
}
