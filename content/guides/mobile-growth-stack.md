## Start with the decision, not the vendor

A stack is useful when it shortens the distance between a question and a trustworthy decision. It becomes expensive theater when several products collect overlapping data that nobody owns. Before evaluating a tool, write the recurring question, who will act on it, how often, and what evidence is currently missing.

## Research and store operations

ASO platforms such as Sensor Tower, MobileAction, AppTweak, App Radar, Appfigures, AppFollow, and SplitMetrics cover different combinations of market intelligence, keyword research, creative analysis, review workflows, and reporting. Their modeled estimates are not first-party store truth. Compare coverage for your markets, freshness, exports, collaboration, and whether the workflow actually replaces manual work.

Run a trial around a real release. Ask every vendor to explain methodology, uncertainty, market coverage, and data retention. A polished difficulty score is still an estimate.

## Product analytics

Google Analytics for Firebase, Mixpanel, and similar products can describe what happens after the install. Segment and other customer-data infrastructure can route events to multiple destinations. The hard part is not installing an SDK; it is maintaining a small event vocabulary whose names, properties, consent behavior, and ownership remain understandable six months later.

Define activation and retention in product terms before building a dashboard. If two teams calculate the same metric differently, fix the contract before interpreting the chart.

## Attribution and links

Branch, AppsFlyer, and Adjust provide mobile measurement and linking products. Evaluate them against privacy requirements, supported networks, deep-link reliability, data access, integration burden, and the decisions you will actually make. Attribution is a model under platform constraints, not a perfect ledger of causality.

Use Apple Universal Links and Android App Links as the durable base for web-to-app navigation. Firebase Dynamic Links shut down on August 25, 2025; do not begin a new implementation with it. Plan migrations with redirect ownership, installed/not-installed behavior, pasteboard and privacy review, and a test matrix for old links.

## Monetization and experimentation

RevenueCat can centralize subscription infrastructure and entitlements. ChartMogul can support subscription analytics. Neither decides packaging, value, or ethical paywall behavior for you. Pair revenue data with product behavior, refunds, support, and retention.

Firebase A/B Testing is for in-product experiments powered by Remote Config and related Firebase capabilities. It is not an App Store product-page test. Use Apple Product Page Optimization or Google Play store listing experiments for their respective store surfaces.

## Buy in layers

1. Start with store consoles, native links, a release log, and reliable product analytics.
2. Add research tooling when the team has a recurring market or keyword decision.
3. Add attribution when paid acquisition scale and channel decisions justify the integration.
4. Add specialized creative, review, or subscription tooling when the operational pain is measurable.
5. Review the stack quarterly; remove tools whose outputs do not change decisions.

The [resource shelf](/resources/) maps current options and records retired products so old articles do not quietly become implementation advice.

### Primary references

- [Apple: Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android: App Links](https://developer.android.com/training/app-links)
- [Firebase: Dynamic Links shutdown FAQ](https://firebase.google.com/support/dynamic-links-faq)
- [Firebase: A/B Testing](https://firebase.google.com/docs/ab-testing)
