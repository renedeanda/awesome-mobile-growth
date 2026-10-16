import { apple } from "./articles/links.ts";
import type { Source } from "./articles/types.ts";

// App Store Connect metric definitions, quoted from Apple's metric reference (checked 2026-10-16).
export const metricsReviewed = "2026-10-16";

export type Metric = {
  slug: string;
  term: string;
  title: string;
  seoTitle: string;
  description: string;
  /** Apple's definition, quoted or closely paraphrased. */
  definition: string;
  formula?: string;
  where: string;
  misread: string;
  useFor: string;
  example?: string;
  sources: Source[];
  related: string[];
};

const where = "App Store Connect › Analytics › Acquisition";

export const metrics: Metric[] = [
  {
    slug: "impressions", term: "Impressions", title: "App Store impressions",
    seoTitle: "What counts as an App Store impression?",
    description: "Apple's definition of impressions and unique device impressions, what they include, and how to use them.",
    definition: "The number of times your app was viewed on the Today, Games, Apps and Search tabs of the App Store for more than one second. Includes product page views. Impressions (Unique Devices) counts each device once.",
    where,
    misread: "An impression isn't interest. Scrolling past your app in search results counts. Featuring, ads and repeated searches can all inflate impressions without anyone considering the app.",
    useFor: "Spotting changes in visibility, and comparing sources. If impressions fall in App Store Search but not Browse, look at rankings; if Browse falls, featuring probably ended.",
    sources: [apple.metrics, apple.acquisition],
    related: ["conversion-rate", "product-page-views", "search-vs-browse"],
  },
  {
    slug: "product-page-views", term: "Product page views", title: "App Store product page views",
    seoTitle: "App Store product page views vs impressions",
    description: "What Apple counts as a product page view, why it isn't the denominator in Apple's conversion rate, and when to use it.",
    definition: "The total number of times your App Store product page was viewed, including when apps load it with StoreKit. Product Page Views (Unique Devices) counts each device once.",
    where,
    misread: "Many tools calculate conversion as downloads ÷ product page views. That's a useful number, but it isn't Apple's conversion rate, which uses unique device impressions. Label the two differently.",
    useFor: "Seeing how many people looked closer. A high page-view rate with low downloads points at the product page itself: screenshots, rating or price.",
    sources: [apple.metrics],
    related: ["impressions", "conversion-rate"],
  },
  {
    slug: "conversion-rate", term: "Conversion rate", title: "App Store conversion rate",
    seoTitle: "App Store conversion rate: Apple's formula and how to read it",
    description: "Apple's conversion rate is downloads and pre-orders divided by unique device impressions. Here's what that means and why third-party benchmarks often don't compare.",
    definition: "Total downloads and pre-orders divided by unique device impressions. A pre-order counts once, when it's made, not again when it downloads.",
    formula: "(Total downloads + pre-orders) ÷ unique device impressions",
    where,
    misread: "Downloads ÷ product page views gives a much higher number and is often reported as \"conversion rate\". Comparing your Apple rate with a benchmark built on page views makes your app look worse than it is.",
    useFor: "Comparing store page changes over time and against Apple's peer group benchmarks, which use the same definition. Read it by source: Search and Browse convert very differently.",
    example: "10,000 unique device impressions, 380 first-time downloads and 20 redownloads give a conversion rate of 400 ÷ 10,000 = 4.0%.",
    sources: [apple.metrics, apple.benchmarks],
    related: ["impressions", "product-page-views", "first-time-downloads"],
  },
  {
    slug: "first-time-downloads", term: "First-time downloads", title: "First-time downloads",
    seoTitle: "App Store first-time downloads vs redownloads vs total downloads",
    description: "How Apple counts first-time downloads, how they differ from redownloads and installs, and when to use each.",
    definition: "The number of first-time downloads on devices with iOS, macOS, tvOS or visionOS. Total Downloads is first-time downloads plus redownloads.",
    where,
    misread: "A first-time download isn't the same as a new active user. Someone can download and never open the app, and one person with two devices can appear more than once.",
    useFor: "Tracking new acquisition. Follow first-time downloads into your product analytics to see how many reach activation.",
    sources: [apple.metrics],
    related: ["redownloads", "conversion-rate"],
  },
  {
    slug: "redownloads", term: "Redownloads", title: "Redownloads",
    seoTitle: "What counts as an App Store redownload?",
    description: "Apple counts a redownload when someone who downloaded the app before taps to download it again. Here's why that matters for campaigns.",
    definition: "The total number of redownloads of your app. Counted when a customer taps the redownload button; doesn't include auto-updates or device restores.",
    where,
    misread: "Redownloads count in total downloads and in Apple's conversion rate. A campaign aimed at past users can show a strong conversion rate while bringing few new people.",
    useFor: "Measuring win-back. Compare redownloads before and after a re-engagement campaign or a big update.",
    sources: [apple.metrics],
    related: ["first-time-downloads", "acquisition-sources"],
  },
  {
    slug: "acquisition-sources", term: "Source types", title: "App Store acquisition source types",
    seoTitle: "App Store Connect source types: Search, Browse, app and web referrers",
    description: "What each App Store Connect source type means, the caveats behind them, and how to compare sources fairly.",
    definition: "App Analytics attributes impressions, downloads and later activity to source types including App Store Search, App Store Browse, app referrers, web referrers and campaigns.",
    where: "App Store Connect › Analytics › Acquisition › Source type",
    misread: "A source isn't a motive. App Store Search includes people who heard about you elsewhere and searched your name, and search-result ads are counted under App Store Search too.",
    useFor: "Finding which sources bring people who stay and pay. Compare retention and proceeds by source, not only downloads.",
    sources: [apple.acquisition],
    related: ["search-vs-browse", "impressions"],
  },
  {
    slug: "search-vs-browse", term: "Search vs Browse", title: "App Store Search vs App Store Browse",
    seoTitle: "App Store Search vs Browse traffic: what each means",
    description: "The difference between App Store Search and Browse traffic, why they convert differently, and how to read changes in each.",
    definition: "App Store Search covers views and downloads from search results, including search ads. App Store Browse covers discovery elsewhere in the store, such as the Today, Games and Apps tabs.",
    where: "App Store Connect › Analytics › Acquisition › Source type",
    misread: "A rise in Search after a keyword change doesn't prove the change worked. Ads, brand demand from press or social, and seasonality all show up in Search too.",
    useFor: "Choosing the right fix. Falling Search usually means rankings or brand demand changed; falling Browse usually means featuring ended.",
    sources: [apple.acquisition, apple.search],
    related: ["acquisition-sources", "conversion-rate"],
  },
  {
    slug: "proceeds-vs-sales", term: "Proceeds vs sales", title: "Proceeds vs sales",
    seoTitle: "App Store proceeds vs sales: what you actually receive",
    description: "Sales is what customers paid; proceeds is Apple's estimate of what you receive after taxes and commission. Here's how to use each.",
    definition: "Sales is the total billed to customers for apps, bundles and in-app purchases (including tax only when it's part of the price). Proceeds is the estimated amount you'll receive: the customer price minus applicable taxes and Apple's commission.",
    where: "App Store Connect › Analytics › Sales; Payments and Financial Reports",
    misread: "Proceeds in analytics are an estimate. Final payments can differ because of refunds, currency conversion and timing. Subscription tools and your bank will show different numbers again.",
    useFor: "Unit economics such as average proceeds per paying user. Reconcile anything important with the financial reports.",
    sources: [apple.metrics, apple.subscriptions],
    related: ["conversion-rate"],
  },
];

export const getMetric = (slug: string) => metrics.find((metric) => metric.slug === slug);
