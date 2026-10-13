export type FieldSource = { label: string; href: string; note?: string };
export type FieldSection = { id: string; title: string; paragraphs: string[]; bullets?: string[] };
export type FieldEntry = {
  slug: string;
  label: string;
  title: string;
  description: string;
  answer: string;
  reviewed: string;
  reading: string;
  sections: FieldSection[];
  sources: FieldSource[];
};

export const reviewed = "2026-10-12";

const appleMetrics = "https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions";
const appleAcquisition = "https://developer.apple.com/help/app-store-connect-analytics/acquisition/acquisition/";
const appleProductPage = "https://developer.apple.com/app-store/product-page/";
const applePpo = "https://developer.apple.com/app-store/product-page-optimization/";
const appleCpp = "https://developer.apple.com/app-store/custom-product-pages/";
const appleScreens = "https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications";
const applePreviews = "https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications";
const googleListing = "https://support.google.com/googleplay/android-developer/answer/9859152";
const googlePolicy = "https://support.google.com/googleplay/android-developer/answer/9898842";
const googleGraphics = "https://support.google.com/googleplay/android-developer/answer/9866151";
const googleCustom = "https://support.google.com/googleplay/android-developer/answer/9867158";
const googleExperiments = "https://support.google.com/googleplay/android-developer/answer/12053285";

const metric = (slug: string, title: string, description: string, answer: string, exact: string, misread: string, decision: string, source = appleMetrics): FieldEntry => ({
  slug, label: "App Store metric", title, description, answer, reviewed, reading: "4 min",
  sections: [
    { id: "definition", title: "The platform definition", paragraphs: [exact] },
    { id: "misread", title: "The common misread", paragraphs: [misread] },
    { id: "decision", title: "The decision it can support", paragraphs: [decision, "Read the number with territory, device, source, product version, and enough time context. A metric can describe an outcome without identifying its cause."] },
  ],
  sources: [{ label: "Apple · Metric definitions", href: source }],
});

export const referenceEntries: FieldEntry[] = [
  metric("impressions", "App Store impressions", "What Apple counts as an impression, where the metric appears, and what it cannot prove.", "An App Store impression is counted when an app is viewed on the Today, Games, Apps, or Search tabs for more than one second. Apple includes product page views in the total.", "Apple defines Impressions as the number of times an app was viewed on App Store discovery surfaces for more than one second. Unique Device Impressions deduplicate those views by device.", "Impressions are exposure, not necessarily intentional consideration. Search, Browse, featuring, ads, and repeated exposure can represent very different levels of intent.", "Use impressions to locate changes in visibility and to compare source mix. Do not use them alone to judge listing quality or product-market fit."),
  metric("product-page-views", "Product page views", "Understand what a product page view means in App Store Connect and why it is not the denominator in Apple’s standard conversion rate.", "Product Page Views count visits to the App Store product page, including pages loaded with StoreKit. They are a useful consideration signal, but Apple’s standard Conversion Rate uses unique impressions instead.", "Apple counts the total number of times the product page was accessed. A separate Unique Devices version deduplicates by device.", "Downloads divided by product page views can be a useful custom diagnostic, but it is not Apple’s standard Conversion Rate. Label that ratio clearly if you calculate it.", "Use page views to understand movement from discovery into deeper consideration and to compare external campaigns that send people directly to a listing."),
  metric("conversion-rate", "App Store conversion rate", "Use Apple’s actual formula and avoid comparing incompatible benchmark definitions.", "Apple’s App Store conversion rate is total downloads and pre-orders divided by unique device impressions. It is not downloads divided by product page views.", "The numerator includes first-time downloads, redownloads, and applicable pre-orders. The denominator is unique device impressions for the selected period.", "Many third-party reports call downloads divided by product page views a conversion rate. Comparing that value with Apple’s metric produces a false benchmark.", "Segment Apple’s rate by source and compare with Apple’s own peer groups. Use product page views as a separate diagnostic, not a replacement denominator."),
  metric("first-time-downloads", "First-time downloads", "Separate new acquisition from redownload behavior.", "A first-time download is the first download of an app by an Apple Account. It is different from an installation count and from a redownload.", "Apple reports First-Time Downloads separately from Redownloads and Total Downloads.", "A first-time download is not guaranteed to equal one new person, one completed onboarding, or one active device.", "Use the metric to follow new acquisition, then connect it to activation and retention in product analytics."),
  metric("redownloads", "Redownloads", "Understand when Apple counts someone downloading an app again.", "A redownload is a manual download by someone who previously downloaded the app. Auto-updates, restores, and automatic downloads onto other devices are excluded.", "Apple includes redownloads in Total Downloads and therefore in its standard conversion-rate numerator.", "A campaign can appear to convert well while attracting returning users rather than entirely new customers.", "Break out first-time downloads and redownloads when diagnosing acquisition or interpreting a campaign."),
  metric("acquisition-sources", "App Store acquisition sources", "Read Search, Browse, app referrer, web referrer, and campaign traffic with the right attribution caveats.", "App Store Connect attributes discovery and downstream activity to source types including App Store Search, Browse, app referrers, web referrers, and campaigns.", "Apple records a download source and can attribute subsequent sales, usage, and subscription data to it. A later manual redownload can reset the source.", "Source is not the same as motivation. App Store Search includes search-result ads, and brand demand may have been created elsewhere.", "Use source comparisons to find where qualified customers originate, then compare activation, retention, proceeds, and refunds—not downloads alone.", appleAcquisition),
  metric("search-vs-browse", "App Store Search versus Browse", "Distinguish intent-driven search exposure from editorial and navigational browse exposure.", "Search includes views and downloads from App Store search, including ads in search results. Browse covers discovery elsewhere in the store, such as Today, Games, and Apps surfaces.", "The two sources represent different contexts and can have very different conversion patterns.", "A change in Search does not automatically prove a keyword change worked; paid search, brand demand, seasonality, and ranking movement may overlap.", "Compare source trends with release dates and marketing activity. Treat source changes as evidence to investigate, not a causal verdict.", appleAcquisition),
  metric("proceeds-vs-sales", "Proceeds versus Sales", "Do not confuse what customers paid with the amount a developer is estimated to receive.", "Sales are amounts billed to customers. Proceeds estimate what the developer receives after applicable taxes and Apple’s commission; final payment can still differ.", "Apple reports Sales and Proceeds as separate metrics and provides finalized payment information in financial reporting.", "Revenue dashboards, subscription platforms, and financial reports may use different timing, currencies, refunds, and definitions.", "Use proceeds for unit-economics context, but reconcile important business decisions with final financial reports."),
  {
    slug: "keyword-field", label: "Apple metadata", title: "The App Store keyword field", description: "Use Apple’s private 100-byte field without duplicate terms, spaces, or imaginary volume scores.", reviewed, reading: "6 min",
    answer: "Apple’s keyword field accepts up to 100 UTF-8 bytes. Use relevant comma-separated terms, avoid wasting bytes on repetition, and validate bytes—not visible character count.",
    sections: [
      { id: "limit", title: "Count bytes, not characters", paragraphs: ["ASCII letters usually consume one byte, while many accented and non-Latin characters consume more. The field can therefore look shorter than its byte limit in some languages."] },
      { id: "selection", title: "Choose terms from product truth", paragraphs: ["Begin with the customer job, reviews, support language, store suggestions, and the words the product can honestly prove. Third-party popularity scores are directional estimates, not store ground truth."], bullets: ["Remove spaces after commas.", "Do not repeat identical tokens already doing useful work in the name or subtitle.", "Do not add competitors or trademarks you do not own.", "Do not create grammatical keyword phrases at the expense of useful distinct tokens."] },
      { id: "validate", title: "Validate the complete system", paragraphs: ["Read the name, subtitle, keywords, screenshots, and onboarding together. The field may influence discovery, but the visible page must still make the promise understandable and credible."] },
    ], sources: [{ label: "Apple · Platform version information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information" }],
  },
  {
    slug: "subtitle", label: "Apple metadata", title: "App Store subtitle", description: "Write the 30-character subtitle as a specific use or benefit, not a duplicate brand line.", reviewed, reading: "5 min",
    answer: "The App Store subtitle is a localizable field of up to 30 characters shown beneath the app name. Use it to clarify the product’s primary use or benefit in language the rest of the page can prove.",
    sections: [
      { id: "job", title: "Give the field one job", paragraphs: ["A subtitle is too small to carry the entire positioning strategy. Choose the most important missing piece after the name: the audience, job, or concrete outcome."] },
      { id: "avoid", title: "Avoid slogan fog", paragraphs: ["Generic claims such as better, smarter, or effortless use scarce space without helping someone classify the product. Prefer recognizable customer language and avoid repeating the brand."] },
      { id: "review", title: "Read it beside screenshot one", paragraphs: ["The subtitle and first creative frame should tell one coherent story. If they promise different products, fix the positioning before polishing either line."] },
    ], sources: [{ label: "Apple · App information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/app-information" }],
  },
  {
    slug: "promotional-text", label: "Apple metadata", title: "App Store promotional text", description: "Use Apple’s 170-character flexible field for timely conversion context rather than keyword stuffing.", reviewed, reading: "5 min",
    answer: "Promotional text is an optional localizable field of up to 170 characters displayed above the description. Apple lets you update it without submitting a new app version; use it for current, truthful conversion context.",
    sections: [
      { id: "purpose", title: "Use it for a timely reason", paragraphs: ["A meaningful new capability, seasonal use, event, or offer can belong here when it is currently available and accurately represented."] },
      { id: "not-keywords", title: "Do not turn it into a keyword container", paragraphs: ["Apple’s search guidance says promotional text does not affect search ranking. Write for the person already evaluating the page."] },
      { id: "operations", title: "Give flexible copy an owner", paragraphs: ["Because promotional text can change outside an app-version submission, record its owner, locale, start date, and expiration condition. Stale urgency erodes trust."] },
    ], sources: [{ label: "Apple · Product page", href: appleProductPage }, { label: "Apple · Platform version information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information" }],
  },
  {
    slug: "product-page-optimization", label: "Apple experimentation", title: "Product Page Optimization", description: "Understand what Apple’s native product-page test can change and how to read the result.", reviewed, reading: "7 min",
    answer: "Product Page Optimization lets eligible App Store pages compare icon, screenshot, and preview treatments with the original page. Begin with a decision and hypothesis; do not treat a winning label as universal proof.",
    sections: [
      { id: "purpose", title: "Optimization answers one decision", paragraphs: ["Use a treatment to test a meaningful creative hypothesis. Multiple unrelated changes make the result harder to interpret and reuse."] },
      { id: "measurement", title: "Read Apple’s estimates correctly", paragraphs: ["Apple reports estimated conversion, relative lift, confidence, and whether a treatment is performing better, worse, collecting data, or likely inconclusive. Traffic mix and external changes still matter."] },
      { id: "learning", title: "Record the lesson, not just the winner", paragraphs: ["Save the audience, dates, creative change, confounders, result, and next decision. An inconclusive test can still reveal that the available traffic cannot answer the question."] },
    ], sources: [{ label: "Apple · Product Page Optimization", href: applePpo }, { label: "Apple · PPO analytics", href: "https://developer.apple.com/help/app-store-connect-analytics/acquisition/product-page-optimization/" }],
  },
  {
    slug: "custom-product-pages", label: "Apple personalization", title: "Custom product pages", description: "Match a specific App Store page to a campaign, audience, keyword, or in-app destination.", reviewed, reading: "7 min",
    answer: "A custom product page is an additional App Store product-page version with its own promotional text and creative. It can support a specific audience promise, unique URL, keyword assignment, and—on supported systems—deep link.",
    sections: [
      { id: "difference", title: "Personalization is not optimization", paragraphs: ["Product Page Optimization asks which treatment performs better for a shared page. A custom product page expresses a different promise for a defined audience or campaign."] },
      { id: "contract", title: "Keep the promise through the handoff", paragraphs: ["The ad, keyword, page, deep link, onboarding, and destination should describe the same value. A personalized page that opens into a generic or unrelated experience creates friction."] },
      { id: "measurement", title: "Measure downstream quality", paragraphs: ["Use page analytics and campaign context, then compare activation, paid conversion, retention, and refunds. More downloads are not automatically better acquisition."] },
    ], sources: [{ label: "Apple · Custom product pages", href: appleCpp }],
  },
  {
    slug: "custom-store-listings", label: "Google Play personalization", title: "Google Play custom store listings", description: "Create a distinct Play listing only when a country, campaign, keyword, or user state deserves a different promise.", reviewed, reading: "7 min",
    answer: "Custom store listings let a developer tailor a Google Play listing to defined audiences such as countries, campaigns, search keywords, or eligible user states. Capacity is not a reason to create variants; each listing needs a distinct job and measurement plan.",
    sections: [
      { id: "audience", title: "Begin with a real audience difference", paragraphs: ["Change the listing when the audience’s context, language, campaign promise, or product destination is meaningfully different—not merely because another slot exists."] },
      { id: "continuity", title: "Preserve message continuity", paragraphs: ["The acquisition message, listing, install, and first-use experience should reinforce the same outcome. Use deep links or onboarding context where the product supports them."] },
      { id: "measurement", title: "Read listing performance in context", paragraphs: ["Compare the custom listing with its traffic source and product outcomes. Differences in audience composition can make a simple listing-to-listing comparison misleading."] },
    ], sources: [{ label: "Google Play · Custom store listings", href: googleCustom }],
  },
  {
    slug: "store-listing-experiments", label: "Google Play experimentation", title: "Google Play store listing experiments", description: "Plan a Play listing experiment around a decision, not a hopeful collection of variants.", reviewed, reading: "7 min",
    answer: "Store listing experiments compare eligible text or creative variants on Google Play. Define the decision, hypothesis, primary measure, audience, and stopping rule before the experiment begins.",
    sections: [
      { id: "setup", title: "Choose a bounded question", paragraphs: ["A test should distinguish between plausible choices. Avoid bundling a new icon, screenshot story, and description rewrite when the team needs to learn which idea mattered."] },
      { id: "confounders", title: "Protect interpretation", paragraphs: ["App releases, campaigns, seasonality, territory mix, store featuring, pricing, and product incidents can change the audience during a test. Record them before declaring a lesson."] },
      { id: "outcome", title: "Keep inconclusive results", paragraphs: ["Do not convert uncertainty into a marketing story. Save the result and decide whether to gather more traffic, make a stronger treatment, or move to a higher-value question."] },
    ], sources: [{ label: "Google Play · Store listing experiments", href: googleExperiments }],
  },
];

export const googleGuides: FieldEntry[] = [
  {
    slug: "android-app-launch-checklist", label: "Launch", title: "Android app launch checklist", description: "Move from product truth through Play Console setup, listing, testing, policy, rollout, and post-launch learning.", reviewed, reading: "12 min",
    answer: "A reliable Google Play launch joins a production-ready Android build to accurate policy declarations, a truthful store listing, tested device experiences, a controlled release, and a measurement plan that extends beyond installs.",
    sections: [
      { id: "ground", title: "Ground the launch in the product", paragraphs: ["Name the audience, job, primary promise, business model, supported devices, data practices, and every claim the store page must prove."], bullets: ["Inventory only shipped capabilities.", "Confirm account, payment, support, and deletion flows.", "Record required policy declarations and target markets.", "Choose a release owner and rollback decision."] },
      { id: "console", title: "Prepare Play Console early", paragraphs: ["Complete the app record, access, policy, content, data-safety, testing, and release prerequisites before the marketing deadline. Console warnings are launch work, not a final-day formality."] },
      { id: "listing", title: "Build the listing as one argument", paragraphs: ["The name, short description, first creative, rating context, and opening description should classify the product quickly. Use natural customer language instead of repeating keywords mechanically."] },
      { id: "release", title: "Use a controlled release", paragraphs: ["Test signed artifacts, installation, upgrades, purchases, restoration, links, notifications, and critical device classes. Choose a rollout strategy proportionate to risk and watch quality alongside acquisition."] },
      { id: "learn", title: "Review the first complete journey", paragraphs: ["Compare listing acquisition with onboarding, activation, paid conversion, retention, reviews, crashes, and support themes. Record what changed before changing the listing again."] },
    ], sources: [{ label: "Google Play · Create and set up your app", href: "https://support.google.com/googleplay/android-developer/answer/9859152" }, { label: "Google Play · Prepare and roll out a release", href: "https://support.google.com/googleplay/android-developer/answer/9859348" }],
  },
  {
    slug: "store-listing-metadata", label: "Metadata", title: "Google Play store listing metadata", description: "Write a clear app name, short description, and full description inside current policy and field limits.", reviewed, reading: "9 min",
    answer: "Google Play uses visible listing fields rather than Apple’s private keyword field. Write naturally for the customer, make the product purpose unmistakable, and keep every claim inside Google Play metadata policy.",
    sections: [
      { id: "fields", title: "Give each visible field one job", paragraphs: ["The app name identifies the product, the short description classifies its use, and the full description gives enough evidence to make an informed decision. Repetition is not a strategy."] },
      { id: "policy", title: "Treat metadata policy as a design constraint", paragraphs: ["Avoid misleading rankings, awards, price claims, promotional language, and formatting that Google prohibits. Verify current policy at submission time because enforcement and examples can change."] },
      { id: "language", title: "Write for meaning and search together", paragraphs: ["Use recognizable category and job language where it fits naturally. Keyword density formulas cannot substitute for relevant, legible copy."] },
      { id: "review", title: "Read copy beside the product", paragraphs: ["Check every capability, price, subscription, privacy statement, and screenshot against the build. Remove future-roadmap language from the live listing."] },
    ], sources: [{ label: "Google Play · Store listing", href: googleListing }, { label: "Google Play · Metadata policy", href: googlePolicy }],
  },
  {
    slug: "screenshot-sizes-and-creative", label: "Creative", title: "Google Play screenshots and creative", description: "Plan screenshots, icon, feature graphic, and video as a truthful system across Play surfaces and devices.", reviewed, reading: "10 min",
    answer: "Google Play creative should show the experience people will receive, remain legible at store scale, and satisfy the current asset requirements for each supported form factor. Verify exact file rules in Play Console before delivery.",
    sections: [
      { id: "system", title: "Build an asset system, not isolated images", paragraphs: ["Keep editable sources, locale, form factor, safe areas, claim owner, and expiration notes with each asset. Reuse a product truth while adapting composition to the placement."] },
      { id: "sequence", title: "Make the opening frames classify the product", paragraphs: ["The first visible assets should answer what the app is, who it serves, and why the experience is credible. One clear claim per frame usually survives a fast scan better than feature collages."] },
      { id: "form-factors", title: "Respect the device using the listing", paragraphs: ["A tablet or Chromebook listing should demonstrate value on that form factor rather than stretching phone marketing. Preview crops and ordering in the actual console and storefront."] },
      { id: "truth", title: "Show what exists", paragraphs: ["Use real UI or clearly disclosed illustrative elements. Do not depict unavailable features, fabricated reviews, impossible results, or a visual quality the shipped experience does not support."] },
    ], sources: [{ label: "Google Play · Graphic assets", href: googleGraphics }, { label: "Google Play · Preview assets policy", href: "https://support.google.com/googleplay/android-developer/answer/1078870" }],
  },
  referenceEntries.find((entry) => entry.slug === "custom-store-listings")!,
  referenceEntries.find((entry) => entry.slug === "store-listing-experiments")!,
  {
    slug: "localization", label: "Markets", title: "Google Play listing localization", description: "Adapt the product promise, search language, and creative to each market instead of translating an English page literally.", reviewed, reading: "8 min",
    answer: "Google Play localization is a market workflow: rebuild relevant vocabulary, adapt the promise and visuals, respect local policy and product availability, and require native review before treating generated copy as final.",
    sections: [
      { id: "market", title: "Choose markets intentionally", paragraphs: ["Use product readiness, support, demand evidence, monetization, legal constraints, and translation capacity. A locale slot is not an obligation to publish weak copy."] },
      { id: "brief", title: "Give translators product context", paragraphs: ["Provide audience, job, screenshots, character limits, terms that must remain unchanged, feature availability, and the intent of every field."] },
      { id: "search", title: "Research local language", paragraphs: ["Literal translation can miss how people describe the problem. Combine native review with store suggestions, reviews, support language, and appropriate third-party estimates."] },
      { id: "creative", title: "Review the whole page", paragraphs: ["Text expansion, cultural references, reading order, device availability, and different proof expectations can all change creative. Inspect the localized listing at realistic sizes."] },
    ], sources: [{ label: "Google Play · Translate and localize your app", href: "https://support.google.com/googleplay/android-developer/answer/9844778" }, { label: "Google Play · Custom store listings", href: googleCustom }],
  },
];

export const growthStages = [
  { id: "discover", title: "Discover", question: "Can the right person encounter the app?", metric: "Qualified reach", failure: "More exposure to the wrong audience" },
  { id: "decide", title: "Decide", question: "Can they understand and trust the promise?", metric: "Consideration and download", failure: "A beautiful page with no clear product" },
  { id: "activate", title: "Activate", question: "Can they reach first value?", metric: "Activation", failure: "Acquisition outruns onboarding" },
  { id: "monetize", title: "Monetize", question: "Does the value support the business model?", metric: "Paid conversion and proceeds", failure: "A paywall before sufficient proof" },
  { id: "retain", title: "Retain", question: "Does value continue after the first session?", metric: "Retention and renewal", failure: "A listing promise the product cannot sustain" },
  { id: "compound", title: "Compound", question: "Does learning and advocacy improve the next cycle?", metric: "Referrals, reviews, repeat demand", failure: "Growth lessons disappear between releases" },
] as const;

export const growthGuides: FieldEntry[] = [
  {
    slug: "app-growth-loop", label: "Framework", title: "The App Growth Loop", description: "Connect discovery, conversion, activation, monetization, retention, and advocacy without pretending one channel creates the whole result.", reviewed, reading: "10 min",
    answer: "Sustainable app growth is a connected loop: reach the right people, make an honest promise, deliver first value, support the business model, retain customers, and carry what you learn into the next acquisition cycle.",
    sections: growthStages.map((stage) => ({ id: stage.id, title: stage.title, paragraphs: [`Ask: ${stage.question} Use ${stage.metric.toLowerCase()} as evidence, then protect against the common failure: ${stage.failure.toLowerCase()}.`, "A stage can limit everything after it. Diagnose the constraint before buying another tool or producing another campaign."] })),
    sources: [{ label: "Apple · Acquisition analytics", href: appleAcquisition }, { label: "Google Play · Statistics", href: "https://support.google.com/googleplay/android-developer/answer/139628" }],
  },
  {
    slug: "mobile-app-growth-strategy", label: "Strategy", title: "Mobile app growth strategy", description: "Choose channels from product economics, audience intent, evidence, and operational capacity—not a universal playbook.", reviewed, reading: "12 min",
    answer: "A useful mobile growth strategy names the customer, product value, business model, current constraint, and the smallest channel experiment that can answer a real decision. ASO is one pillar, not the entire system.",
    sections: [
      { id: "diagnose", title: "Diagnose before selecting a channel", paragraphs: ["A new app with no qualified visibility has a different problem from an app with strong traffic and poor activation. Map the journey before choosing ASO, web content, paid acquisition, partnerships, referrals, or lifecycle work."] },
      { id: "economics", title: "Respect the business model", paragraphs: ["Paid apps, subscriptions, advertising, commerce, and enterprise products support different acquisition costs and time horizons. Do not borrow a funnel whose economics cannot fit the product."] },
      { id: "portfolio", title: "Build a small channel portfolio", paragraphs: ["Use one dependable channel, one learning channel, and one compounding asset before operating everywhere. Store presence, web demand, product referrals, and paid media can reinforce one another when the message stays coherent."] },
      { id: "cadence", title: "Run a decision cadence", paragraphs: ["Record the hypothesis, cost, audience, primary outcome, guardrails, and next move. Stop activities that cannot teach or compound."] },
    ], sources: [{ label: "Apple · Acquisition", href: appleAcquisition }, { label: "RevenueCat · State of Subscription Apps", href: "https://www.revenuecat.com/state-of-subscription-apps/" }],
  },
  {
    slug: "web-to-app-funnels", label: "Acquisition", title: "Web-to-app funnels", description: "Decide when a web journey adds useful qualification, education, or payment—and when it only adds friction.", reviewed, reading: "14 min",
    answer: "A web-to-app funnel moves acquisition through a web experience before or alongside the app. It can support education, qualification, personalization, account creation, or payment, but adds handoff, policy, attribution, support, and conversion complexity.",
    sections: [
      { id: "shape", title: "Map the complete handoff", paragraphs: ["A common path is ad or search → landing page → education or quiz → account or offer → store or web checkout → app install → signed-in first value. Every step needs ownership and measurement."] },
      { id: "readiness", title: "Use a readiness test", paragraphs: ["A web step is more plausible when the product benefits from explanation or qualification, identity can persist through install, entitlements can synchronize reliably, and the team can support web billing and regional policy."], bullets: ["Can the web experience create value before install?", "Can account and purchase state survive the handoff?", "Can you measure each step without double counting?", "Can support explain refunds, access, and billing ownership?", "Have current storefront rules been reviewed for every market?"] },
      { id: "tradeoffs", title: "Count the friction as well as the upside", paragraphs: ["A web funnel can improve explanation and first-party context while losing people at extra steps. Payment economics are only one part of the decision; conversion, retention, support, tax, and policy matter too."] },
      { id: "policy", title: "Treat policy as storefront-specific", paragraphs: ["Apple and Google rules vary by storefront, program, product type, and date. Link to current platform terms and legal guidance before implementing external purchase calls to action."] },
      { id: "test", title: "Test the route, not the hype", paragraphs: ["Compare qualified downstream outcomes with a direct-to-store route. Include acquisition cost, landing completion, store click, install, activation, paid conversion, retention, refunds, and support load."] },
    ], sources: [{ label: "RevenueCat · Web-to-app funnels", href: "https://www.revenuecat.com/blog/growth/web-to-app-funnels" }, { label: "Apple · App Review Guidelines", href: "https://developer.apple.com/app-store/review/guidelines/" }, { label: "Google Play · External offers", href: "https://support.google.com/googleplay/android-developer/answer/14372887" }],
  },
  {
    slug: "aso-and-paid-acquisition", label: "Channels", title: "ASO and paid acquisition", description: "Share intent and creative learning across paid and organic work without confusing attribution with incrementality.", reviewed, reading: "10 min",
    answer: "ASO and paid acquisition work best when they share audience intent, product proof, and creative learning. Keep measurement distinct: a campaign can influence store behavior without proving an organic ranking or incremental download.",
    sections: [
      { id: "intent", title: "Share the intent map", paragraphs: ["Paid query data, landing-page behavior, reviews, support language, and store suggestions can improve the vocabulary map. None is a perfect substitute for another channel’s context."] },
      { id: "continuity", title: "Carry the promise through the page", paragraphs: ["Use custom product pages or custom store listings when a campaign makes a specific promise. The first app experience should continue that promise rather than reset the customer to a generic homepage."] },
      { id: "creative", title: "Share learnings, not finished assets", paragraphs: ["An ad must stop attention; a store page must support a download decision. Reuse insights about audiences and proof while adapting composition to the placement."] },
      { id: "measure", title: "Separate attribution and incrementality", paragraphs: ["Attributed downloads tell you which path received credit. They do not reveal how many people would have installed anyway or whether paid activity changed organic discovery."] },
    ], sources: [{ label: "Apple · Custom product pages", href: appleCpp }, { label: "Google Play · Custom store listings", href: googleCustom }],
  },
  {
    slug: "acquisition-to-retention", label: "Measurement", title: "From acquisition to retention", description: "Connect store metrics to activation, payment, retention, quality, and reviews so acquisition remains accountable to the product.", reviewed, reading: "10 min",
    answer: "A store-page win is valuable only when the acquired audience can activate, receive the promised value, and remain worth serving. Read downloads with product and business outcomes rather than optimizing the store in isolation.",
    sections: [
      { id: "funnel", title: "Keep metric definitions intact", paragraphs: ["Impressions, page views, downloads, installations, sessions, active devices, trials, paid plans, and retention describe different events. Name the exact numerator, denominator, population, and time window."] },
      { id: "quality", title: "Use quality guardrails", paragraphs: ["For every acquisition experiment, choose at least one downstream guardrail such as activation, D7 retention, refund rate, crash rate, or support burden."] },
      { id: "segments", title: "Compare like with like", paragraphs: ["Source, territory, device, version, campaign, and product page can change audience quality. Aggregate conversion can improve while an important segment gets worse."] },
      { id: "learning", title: "Return product evidence to the page", paragraphs: ["Reviews, onboarding failures, retention, and support themes should influence metadata and creative. Remove claims that attract people the product cannot serve."] },
    ], sources: [{ label: "Apple · Analytics dashboard", href: "https://developer.apple.com/help/app-store-connect-analytics/overview/analytics-dashboard" }, { label: "Apple · Peer group benchmarks", href: "https://developer.apple.com/help/app-store-connect-analytics/benchmarks/peer-group-benchmarks/" }],
  },
  {
    slug: "subscription-funnel", label: "Monetization", title: "Subscription app funnel", description: "Connect acquisition, onboarding, paywall, trial, paid conversion, renewal, churn, and win-back without hiding the product value.", reviewed, reading: "12 min",
    answer: "A subscription funnel is the full path from qualified discovery to recurring value. Optimize the handoffs together: acquisition promise, first value, offer, purchase, entitlement, renewal, support, and retention.",
    sections: [
      { id: "promise", title: "Begin with the recurring value", paragraphs: ["A subscription is not the product. Explain what improves repeatedly and show enough proof before asking for an ongoing commitment."] },
      { id: "measurement", title: "Define every stage", paragraphs: ["Track exposure, install, onboarding completion, paywall view, trial start, paid conversion, renewal, churn, refund, and reactivation with explicit populations and windows."] },
      { id: "offers", title: "Treat offers as product decisions", paragraphs: ["Trials, introductory offers, discounts, and win-back offers change who converts and why. Judge them by retained proceeds and customer experience, not starts alone."] },
      { id: "systems", title: "Reconcile systems", paragraphs: ["App Store Connect, Play Console, subscription infrastructure, payment processors, and product analytics can differ in attribution, currency, refund timing, and identity. Document the source of truth for each decision."] },
    ], sources: [{ label: "Apple · Subscription analytics", href: "https://developer.apple.com/help/app-store-connect-analytics/measure-subscription-performance/view-subscription-data" }, { label: "RevenueCat · Subscription app resources", href: "https://www.revenuecat.com/blog/" }],
  },
  {
    slug: "mobile-app-onboarding", label: "Activation", title: "Mobile app onboarding", description: "Carry the acquisition promise into first value without turning setup, permissions, or account creation into a maze.", reviewed, reading: "9 min",
    answer: "Good onboarding continues the promise that earned the install and removes everything that does not help the customer reach first value safely. Measure activation, not slide completion.",
    sections: [
      { id: "continuity", title: "Continue the store promise", paragraphs: ["If the listing foregrounds one outcome, onboarding should help the customer reach it. Do not open with an unrelated feature tour or organizational history."] },
      { id: "friction", title: "Earn each request", paragraphs: ["Ask for accounts, permissions, preferences, and payment only when the customer understands why they are needed. Explain consequences in customer language."] },
      { id: "activation", title: "Choose a meaningful activation event", paragraphs: ["Activation should represent experienced value, not a button tap chosen because it is easy to count. Validate that the event predicts retention or useful behavior."] },
      { id: "segments", title: "Preserve acquisition context", paragraphs: ["A customer arriving from a specific page or campaign may need a different first path. Use deep linking or carried context when the product can support it reliably."] },
    ], sources: [{ label: "Apple · Human Interface Guidelines · Onboarding", href: "https://developer.apple.com/design/human-interface-guidelines/onboarding" }, { label: "Android · Permissions UX", href: "https://developer.android.com/training/permissions/usage-notes" }],
  },
  {
    slug: "app-referral-loop", label: "Compounding", title: "App referral and advocacy loop", description: "Design sharing, ratings, reviews, and referrals around earned value rather than interruption or manipulation.", reviewed, reading: "8 min",
    answer: "A referral loop begins after demonstrated value. Make the shared object useful, preserve recipient context, ask at an earned moment, and measure whether referred customers activate and retain—not just whether a link was sent.",
    sections: [
      { id: "value", title: "Find the naturally shareable value", paragraphs: ["The strongest loop often shares an outcome, collaboration, artifact, invitation, or progress that is useful to both sender and recipient."] },
      { id: "handoff", title: "Preserve recipient context", paragraphs: ["The link, landing page, store page, install, and first open should explain what was shared and where to continue. A generic handoff wastes the social context."] },
      { id: "ratings", title: "Keep ratings separate from referrals", paragraphs: ["Use platform-provided review prompts after earned value. Do not gate functionality, manipulate sentiment, or route unhappy customers away from a fair rating opportunity."] },
      { id: "quality", title: "Measure referred quality", paragraphs: ["Track activation, retention, purchase, abuse, and support burden. A high invitation rate can still produce a poor customer experience."] },
    ], sources: [{ label: "Apple · Requesting App Store reviews", href: "https://developer.apple.com/documentation/storekit/requestreviewaction" }, { label: "Google Play · In-app reviews", href: "https://developer.android.com/guide/playcore/in-app-review" }],
  },
];

export const aiGuides: FieldEntry[] = [
  {
    slug: "aso-with-ai", label: "AI field guide", title: "ASO with AI, without invented certainty", description: "Use a model for synthesis, critique, and drafts while keeping facts, product truth, and final judgment human-verifiable.", reviewed, reading: "10 min",
    answer: "AI can organize evidence, propose alternatives, validate mechanics, and expose inconsistencies. It cannot know private store algorithms, ground-truth keyword volume, your unshared product behavior, or whether generated copy is true.",
    sections: [
      { id: "inputs", title: "Give the model evidence, not vibes", paragraphs: ["Provide the audience, job, shipped features, exclusions, business model, current metadata, screenshots, reviews, support themes, and primary platform documentation. Mark private material explicitly."] },
      { id: "jobs", title: "Use AI for bounded jobs", paragraphs: ["Good jobs include clustering language, finding duplicated terms, generating alternatives, checking consistency, drafting a screenshot brief, or turning an experiment note into a structured record."] },
      { id: "limits", title: "Keep uncertainty visible", paragraphs: ["A model can suggest search phrases but cannot supply authoritative search volume or ranking causality. It can draft localization but cannot replace an informed native reviewer."] },
      { id: "review", title: "Review as a diff", paragraphs: ["Preserve the original, inspect each proposed change, trace claims to product evidence, validate limits, and reject generic wording that erases the brand voice."] },
    ], sources: [{ label: "Apple · Product page", href: appleProductPage }, { label: "Google Play · Store listing", href: googleListing }],
  },
  {
    slug: "ai-app-store-metadata", label: "AI workflow", title: "AI-assisted App Store metadata", description: "Turn a product brief into reviewable metadata proposals without overwriting crafted copy or leaking reviewer notes.", reviewed, reading: "9 min",
    answer: "Use AI-assisted metadata as a preserve-and-propose workflow: inventory the canonical copy, build a factual brief, draft field-specific alternatives, validate limits, and approve a diff. Never make the generated draft the source of truth automatically.",
    sections: [
      { id: "inventory", title: "Inventory before drafting", paragraphs: ["Find the current listing, release notes, shipped UI, pricing boundary, privacy facts, screenshots, reviewer notes, and localization sources. Public copy and internal review context must remain separate."] },
      { id: "brief", title: "Build a factual brief", paragraphs: ["Name the target customer, primary job, promise, product proof, limitations, unavailable features, and sensitive claims. Ask the model to identify unknowns rather than fill them."] },
      { id: "fields", title: "Draft by field purpose", paragraphs: ["The name identifies, subtitle clarifies, promotional text supplies current context, description explains and proves, keywords support discovery, and What’s New describes customer-visible change."] },
      { id: "gate", title: "Apply the voice and truth gate", paragraphs: ["Reject implementation jargon, fabricated benefits, generic superlatives, unshipped features, price drift, and copy that sounds interchangeable with any app."] },
    ], sources: [{ label: "Apple · App information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/app-information" }, { label: "Apple · Platform version information", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information" }],
  },
  {
    slug: "ai-keyword-research", label: "AI workflow", title: "AI-assisted ASO keyword research", description: "Use models to organize real language and intent—not to fabricate store search volume or difficulty.", reviewed, reading: "8 min",
    answer: "AI is useful for clustering customer language, expanding concepts, identifying intent, and mapping phrases to product proof. Treat every generated phrase as a candidate until it is validated for relevance, policy, market language, and available evidence.",
    sections: [
      { id: "corpus", title: "Start with a real language corpus", paragraphs: ["Collect reviews, support conversations, interviews, store suggestions, competitor positioning, product UI language, and appropriate third-party estimates. Remove personal and confidential information before sharing."] },
      { id: "cluster", title: "Cluster by decision intent", paragraphs: ["Group phrases by the job and expectation behind them, not merely shared words. Ask which product proof and page promise would satisfy each cluster."] },
      { id: "validate", title: "Validate generated candidates", paragraphs: ["Check product relevance, market idiom, policy, trademark risk, field fit, and whether the product can retain someone arriving with that expectation."] },
      { id: "unknown", title: "Say what is unknown", paragraphs: ["A model’s frequency intuition is not App Store or Google Play search volume. Label third-party popularity and difficulty values as vendor estimates with a date and market."] },
    ], sources: [{ label: "Apple · Optimizing for discovery", href: "https://developer.apple.com/app-store/discoverability/" }, { label: "Google Play · Metadata policy", href: googlePolicy }],
  },
  {
    slug: "ai-aso-localization", label: "AI workflow", title: "AI-assisted ASO localization", description: "Draft market-specific metadata while protecting meaning, field limits, product availability, and native tone.", reviewed, reading: "9 min",
    answer: "AI can accelerate a localization draft, terminology table, and consistency review. It cannot certify market fit or native tone. Provide context, validate bytes and characters, and require a native reviewer before publication.",
    sections: [
      { id: "context", title: "Translate the product decision", paragraphs: ["Give the model the audience, job, tone, screenshots, market, character limits, protected terms, product availability, and the purpose of each field."] },
      { id: "vocabulary", title: "Rebuild search vocabulary locally", paragraphs: ["Do not copy English keywords into every market. Use local reviews, suggestions, category language, and native judgment to identify how the problem is actually described."] },
      { id: "mechanics", title: "Validate each locale mechanically", paragraphs: ["Check visible characters, Apple keyword bytes, line breaks, punctuation, claims, formatting, and screenshot text expansion independently for every locale."] },
      { id: "review", title: "Keep human review explicit", paragraphs: ["Mark machine-drafted text as pending native review. Ask the reviewer about tone, idiom, search language, cultural fit, and misleading implications—not grammar alone."] },
    ], sources: [{ label: "Apple · Localize app information", href: "https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-information" }, { label: "Google Play · Localization", href: "https://support.google.com/googleplay/android-developer/answer/9844778" }],
  },
  {
    slug: "ai-screenshot-briefs", label: "AI workflow", title: "AI-assisted screenshot briefs", description: "Use product evidence to draft a visual argument without generating a fictional app experience.", reviewed, reading: "8 min",
    answer: "AI can help map audience objections to screenshot messages, sequence proof, and adapt a brief across devices or locales. The source images and claims still need to come from the real product.",
    sections: [
      { id: "evidence", title: "Inventory visible product proof", paragraphs: ["List the screens, states, interactions, outcomes, and customer language the current build can demonstrate. Exclude roadmap features and simulated results."] },
      { id: "sequence", title: "Create one job per frame", paragraphs: ["Ask the model to propose message → product proof → required capture → caption → locale risk. Reject frames that need decoration because the product evidence is weak."] },
      { id: "formats", title: "Route the brief through current specs", paragraphs: ["Treat platform and device requirements as sourced inputs, not model memory. Validate crops, sizes, count, file type, and video behavior against current documentation."] },
      { id: "review", title: "Review at thumbnail size", paragraphs: ["Test legibility, hierarchy, truthful composition, localization expansion, and whether the first frames classify the app in a one-second scan."] },
    ], sources: [{ label: "Apple · Screenshot specifications", href: appleScreens }, { label: "Google Play · Graphic assets", href: googleGraphics }],
  },
  {
    slug: "verify-ai-generated-aso", label: "AI review", title: "Verify AI-generated ASO work", description: "A practical truth, privacy, policy, voice, localization, and mechanics review before generated work reaches a store.", reviewed, reading: "9 min",
    answer: "Verify generated ASO in six passes: product truth, private-data separation, platform policy, field mechanics, brand voice, and market context. A fluent draft is not evidence that any claim is correct.",
    sections: [
      { id: "truth", title: "Product truth", paragraphs: ["Trace every feature, result, integration, privacy statement, device requirement, and price implication to the shipped product or an approved launch commitment."] },
      { id: "privacy", title: "Private-data separation", paragraphs: ["Remove reviewer notes, credentials, bundle identifiers, internal paths, customer information, unreleased strategy, and confidential analytics from public output."] },
      { id: "policy", title: "Platform policy", paragraphs: ["Review trademarks, superlatives, rankings, awards, offers, health or financial claims, screenshot truthfulness, and current metadata rules."] },
      { id: "mechanics", title: "Field mechanics", paragraphs: ["Validate characters, UTF-8 bytes, accepted asset formats, localization completeness, required URLs, and the exact console preview."] },
      { id: "voice", title: "Voice and meaning", paragraphs: ["Reject interchangeable copy, implementation jargon, repetitive claims, unnatural localization, and language that conflicts with the product’s actual relationship to the customer."] },
      { id: "decision", title: "Human decision", paragraphs: ["Review a diff, record remaining unknowns, and require explicit authorization before an agent writes to a live store console."] },
    ], sources: [{ label: "Apple · App Review Guidelines", href: "https://developer.apple.com/app-store/review/guidelines/" }, { label: "Google Play · Metadata policy", href: googlePolicy }],
  },
];

export const teardownEntries: FieldEntry[] = [
  {
    slug: "alltrails", label: "Public listing anatomy", title: "AllTrails: intent across web and store", description: "A dated, public-evidence review of how a recognizable outdoor job can travel from search intent into product proof.", reviewed, reading: "7 min",
    answer: "AllTrails is useful to study because the product category contains concrete jobs—finding, evaluating, navigating, and sharing routes. This teardown examines message continuity, not private performance or ranking causes.",
    sections: [
      { id: "observe", title: "What is publicly observable", paragraphs: ["The public web and store presence can be reviewed for category language, route discovery, maps, safety or planning proof, subscription context, and continuity between acquisition surfaces."] },
      { id: "interpret", title: "What that might mean", paragraphs: ["A clear outdoor job can support both non-branded discovery and feature-specific landing experiences. Recognizable map and trail evidence can reduce the distance between promise and product."] },
      { id: "unknown", title: "What remains unknown", paragraphs: ["The private keyword field, ranking inputs, experiment history, source mix, conversion, retention, and economics are not visible and must not be inferred from the listing."] },
      { id: "test", title: "A testable lesson", paragraphs: ["For an app with multiple customer jobs, map each high-intent job to one page promise, one first creative proof, and one relevant first-use destination. Test downstream activation, not downloads alone."] },
    ], sources: [{ label: "AllTrails · App Store listing", href: "https://apps.apple.com/us/app/alltrails-hike-bike-run/id405075943" }, { label: "AllTrails · Website", href: "https://www.alltrails.com/" }],
  },
  {
    slug: "duolingo", label: "Public listing anatomy", title: "Duolingo: recognition before explanation", description: "A public-evidence review of brand recognition, creative hierarchy, product proof, and the limits of copying a category leader.", reviewed, reading: "7 min",
    answer: "Duolingo demonstrates how a recognizable brand and character can compress the decision, but its scale makes it a poor template for an unknown app. Study the hierarchy and continuity; do not copy the surface style.",
    sections: [
      { id: "observe", title: "What is publicly observable", paragraphs: ["The public listing can be reviewed for brand prominence, character use, language-learning promise, UI evidence, social proof, subscription context, and continuity with the app’s broader marketing."] },
      { id: "interpret", title: "What that might mean", paragraphs: ["Existing recognition can let creative spend less space classifying the product. An unfamiliar app usually needs more explicit category and outcome language in the same positions."] },
      { id: "unknown", title: "What remains unknown", paragraphs: ["Public creative cannot reveal the causal contribution of ASO, paid acquisition, brand demand, notifications, product loops, or experiment history."] },
      { id: "test", title: "A testable lesson", paragraphs: ["Ask whether screenshot one works for someone who has never heard of the brand. Compare explicit product classification with brand-led creative and watch activation quality as well as store conversion."] },
    ], sources: [{ label: "Duolingo · App Store listing", href: "https://apps.apple.com/us/app/duolingo-language-lessons/id570060128" }, { label: "Duolingo · Website", href: "https://www.duolingo.com/" }],
  },
  {
    slug: "gentler-streak", label: "Public listing anatomy", title: "Gentler Streak: focused Apple-platform positioning", description: "A public-evidence review of a specific product philosophy, health context, and platform-shaped creative.", reviewed, reading: "7 min",
    answer: "Gentler Streak is useful to study as an Apple-platform product with a focused relationship to fitness and recovery. The lesson is message discipline and platform fit—not an inferred growth formula.",
    sections: [
      { id: "observe", title: "What is publicly observable", paragraphs: ["The public listing can be inspected for its fitness and recovery framing, Apple-device context, UI evidence, health-data language, awards or editorial recognition that are publicly documented, and subscription presentation."] },
      { id: "interpret", title: "What that might mean", paragraphs: ["A clear product philosophy can differentiate an app in a crowded category when the screenshots and onboarding consistently demonstrate it."] },
      { id: "unknown", title: "What remains unknown", paragraphs: ["The listing does not reveal private keywords, acquisition mix, experiment results, retention cohorts, or the relative impact of platform recognition."] },
      { id: "test", title: "A testable lesson", paragraphs: ["Write the product’s relationship to the customer in one sentence, then audit every store frame and onboarding step for contradictions. Test a philosophy-led opening against a feature-led one."] },
    ], sources: [{ label: "Gentler Streak · App Store listing", href: "https://apps.apple.com/us/app/gentler-streak-fitness-tracker/id1576857102" }, { label: "Gentler Streak · Website", href: "https://gentler.app/" }],
  },
];

export const updates: FieldEntry[] = [
  {
    slug: "october-2026-app-store-creative", label: "Effective now and upcoming", title: "October 2026 App Store creative changes", description: "A decision-focused index to Apple’s Asset Library, product-page headers, search-result creative, and upcoming iPhone Duo work.", reviewed, reading: "5 min",
    answer: "Apple’s current creative system adds product-page header and search-result assets alongside screenshots. iPhone Duo screenshot delivery is an upcoming requirement dated for April 2027, not a universal requirement today.",
    sections: [
      { id: "now", title: "Effective now", paragraphs: ["Teams can plan the new product-page header and search-result creative as separate placements with their own aspect ratios and playback behavior. Screenshots remain a distinct proof sequence."] },
      { id: "upcoming", title: "Upcoming", paragraphs: ["Apple has published iPhone Duo screenshot guidance tied to the iOS 27.1 SDK and an April 2027 requirement date. Keep source files flexible and label the requirement as upcoming until it applies."] },
      { id: "action", title: "What to do", paragraphs: ["Inventory editable creative sources, define placement-safe compositions, plan silent-first video, keep essential content away from edges, and verify final requirements in App Store Connect before delivery."] },
    ], sources: [{ label: "Apple · Creative asset specifications", href: "https://developer.apple.com/help/app-store-connect/reference/app-information/creative-asset-specifications" }, { label: "Apple · Screenshot specifications", href: appleScreens }],
  },
];

export const fieldCollections = {
  reference: referenceEntries,
  google: googleGuides,
  growth: growthGuides,
  ai: aiGuides,
  teardowns: teardownEntries,
  updates,
};

export function getFieldEntry(collection: keyof typeof fieldCollections, slug: string) {
  return fieldCollections[collection].find((entry) => entry.slug === slug);
}
