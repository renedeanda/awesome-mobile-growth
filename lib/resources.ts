export type Resource = { name: string; href: string; note: string; status?: "active" | "transition" };
export type ResourceGroup = { title: string; description: string; items: Resource[] };

export const resourceGroups: ResourceGroup[] = [
  { title: "ASO research & operations", description: "Different products emphasize market intelligence, keyword workflows, creative, reviews, and reporting. Trial against a real decision before buying.", items: [
    { name: "Sensor Tower", href: "https://sensortower.com/", note: "Market intelligence and app-store research." }, { name: "MobileAction", href: "https://www.mobileaction.co/", note: "ASO, paid acquisition, and competitive intelligence." }, { name: "AppTweak", href: "https://www.apptweak.com/", note: "ASO research, monitoring, and reporting." }, { name: "App Radar", href: "https://appradar.com/", note: "Store listing and ASO workflow tooling." }, { name: "Appfigures", href: "https://appfigures.com/", note: "App intelligence, reviews, analytics, and reporting." }, { name: "AppFollow", href: "https://appfollow.io/", note: "Review management, monitoring, and organic-growth workflows." }, { name: "SplitMetrics", href: "https://splitmetrics.com/", note: "Creative testing and mobile growth products." },
  ]},
  { title: "Analytics", description: "Choose the smallest instrumentation stack that can answer activation, retention, and experiment questions consistently.", items: [
    { name: "Google Analytics for Firebase", href: "https://firebase.google.com/docs/analytics", note: "App analytics integrated with the Firebase ecosystem." }, { name: "Mixpanel", href: "https://mixpanel.com/", note: "Product analytics and behavioral funnels." }, { name: "Segment", href: "https://segment.com/", note: "Customer-data collection and routing infrastructure." },
  ]},
  { title: "Attribution & linking", description: "Attribution products can help with campaign measurement; native platform links remain the durable foundation for deep linking.", items: [
    { name: "Branch", href: "https://www.branch.io/", note: "Mobile measurement and linking." }, { name: "AppsFlyer", href: "https://www.appsflyer.com/", note: "Attribution, measurement, and deep-linking products." }, { name: "Adjust", href: "https://www.adjust.com/", note: "Mobile measurement and attribution." }, { name: "Apple Universal Links", href: "https://developer.apple.com/ios/universal-links/", note: "Native web-to-app links on Apple platforms." }, { name: "Android App Links", href: "https://developer.android.com/training/app-links", note: "Verified native web-to-app links on Android." },
  ]},
  { title: "Monetization", description: "Subscription infrastructure and revenue analysis support the work after the store-page tap.", items: [
    { name: "RevenueCat", href: "https://www.revenuecat.com/", note: "In-app subscription infrastructure and analytics." }, { name: "ChartMogul", href: "https://chartmogul.com/", note: "Subscription analytics and revenue reporting." },
  ]},
];

export const transitions: Resource[] = [
  { name: "App Annie / data.ai → Sensor Tower", href: "https://sensortower.com/blog/sensor-tower-acquires-data-ai", note: "data.ai joined Sensor Tower in 2024; update old bookmarks and vendor references.", status: "transition" },
  { name: "TheTool → App Radar", href: "https://appradar.com/blog/appradar-acquires-thetool", note: "App Radar acquired TheTool; use App Radar for current product information.", status: "transition" },
  { name: "Storemaven → Zynga", href: "https://www.zynga.com/news/zynga-to-acquire-storemaven/", note: "Zynga acquired Storemaven in 2022; do not treat the old product as an independent current vendor.", status: "transition" },
  { name: "Firebase Dynamic Links retired", href: "https://firebase.google.com/support/dynamic-links-faq", note: "The service shut down on August 25, 2025. Migrate to native links or another provider.", status: "transition" },
];
