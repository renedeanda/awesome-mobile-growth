import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout, MetadataLimits, SpecGrid, WorkbenchLink } from "@/components/ContentBlocks";
import { DecisionPath, LaunchChecklist, PlatformGuide, PlatformSources } from "@/components/PlatformGuide";
import { appleGuide, applePlatformGuides, appleSources, macScreenshotSizes, platformComparison, type ApplePlatformGuide } from "@/lib/applePlatforms";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return applePlatformGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = applePlatformGuides.find((item) => item.slug === slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.title, description: guide.description, path: `/apple-platforms/${guide.slug}/`, type: "article", imagePath: "/apple-platforms/opengraph-image", imageAlt: "Apple App Store launch guides for iPhone, iPad, Mac, and Universal Purchase" });
}

const sections = {
  "macos-app-store-launch": [["choose-the-mac-app","Choose the Mac app"],["app-record","Set up the app record"],["product-page","Build the Mac product page"],["quality","Prove desktop quality"],["review-release","Review and release"],["measure","Measure the launch"]],
  "universal-purchase": [["mental-model","The mental model"],["before-you-start","Before you start"],["shared-and-specific","Shared and platform-specific"],["purchases","Purchases and migration"],["checklist","Implementation checklist"]],
  "iphone-app-store-launch": [["foundation","Build the foundation"],["metadata","Write the listing"],["creative","Make the visual argument"],["quality","Validate the release"],["submission","Submit and release"],["learning","Learn after launch"]],
  "ipad-app-store-launch": [["relationship","Understand the iPad relationship"],["product","Earn the big canvas"],["creative","Build iPad creative"],["quality","Test like an iPad user"],["launch","Launch and learn"]],
  "app-store-launch-requirements": [["comparison","Platform comparison"],["metadata","Metadata model"],["screenshots","Screenshot requirements"],["previews","Preview requirements"],["submission","Submission model"],["sources","Primary sources"]],
} as const satisfies Record<ApplePlatformGuide["slug"], ReadonlyArray<readonly [string, string]>>;

export default async function ApplePlatformGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = applePlatformGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const toc = sections[guide.slug].map(([id, label]) => ({ id, label }));
  return <PlatformGuide guide={guide} sections={toc}>{contentFor(guide.slug)}</PlatformGuide>;
}

function contentFor(slug: ApplePlatformGuide["slug"]) {
  switch (slug) {
    case "macos-app-store-launch": return <MacGuide />;
    case "universal-purchase": return <UniversalPurchaseGuide />;
    case "iphone-app-store-launch": return <IPhoneGuide />;
    case "ipad-app-store-launch": return <IPadGuide />;
    case "app-store-launch-requirements": return <RequirementsGuide />;
  }
}

function MacGuide() {
  return <>
    <h2 id="choose-the-mac-app">Choose the Mac app before you choose the listing</h2>
    <p>There are three different ways an iPhone or iPad product can reach Mac users. They do not create the same product, distribution path, or store story.</p>
    <DecisionPath items={[
      { label: "Native macOS", title: "Build for the desktop", detail: "Choose this when menus, windows, keyboard work, file behavior, automation, and deep Mac conventions are central to the product." },
      { label: "Mac Catalyst", title: "Bring the iPad foundation", detail: "Choose this when the iPad codebase is the right starting point and you can still finish the experience for Mac input, windows, menus, and layout." },
      { label: "iOS app on Mac", title: "Offer compatibility", detail: "Apple silicon Macs can run eligible iPhone and iPad apps. This is availability, not a substitute for a deliberately designed Mac product." },
    ]} />
    <Callout tone="caution" title="Decide before creating records"><p>If separate iOS and macOS app records already exist, Apple does not let you merge them into one Universal Purchase. Map the intended ownership and purchase experience first.</p></Callout>
    <p><strong>Editorial rule:</strong> do not call an app “made for Mac” because it launches on a Mac. The store promise should match the interaction model you actually ship.</p>

    <h2 id="app-record">Add macOS to the existing app record</h2>
    <p>For a Universal Purchase, open the existing app record in App Store Connect and add macOS as a platform. Apple says the Mac app uses the same Apple ID, SKU, and bundle ID as the iOS app. You upload the Mac build from a separate target, and the platform versions may use different version and build numbers.</p>
    <SpecGrid label="Mac app record decisions" items={[
      { label: "Identity", values: [{ label: "Shared", value: "Apple ID, SKU, bundle ID, app record" }, { label: "Platform delivery", value: "A separate macOS target and build" }] },
      { label: "Versioning", values: [{ label: "Allowed", value: "Different platform version and build numbers" }, { label: "Operational advice", value: "Document the mapping for support and release notes" }] },
      { label: "Initial transfer", values: [{ label: "Apple transfers", value: "Most existing app information" }, { label: "Prepare for macOS", value: "Promotional text, description, and screenshots" }] },
    ]} />
    <Callout tone="official" title="Universal Purchase becomes durable"><p>After App Review approves versions on at least two platforms, Apple says the app becomes a Universal Purchase and remains one. You can no longer remove a platform version from the app record.</p></Callout>
    <p>If an eligible iPhone or iPad app is already offered on Apple silicon Macs, releasing a native macOS platform version replaces that iOS-on-Mac version in the Mac App Store. Existing users receive the Mac app as an update. Test data, files, accounts, and purchase restoration with that transition in mind.</p>
    <PlatformSources items={[appleSources.addPlatforms, appleSources.universalPurchase, appleSources.iosOnMac]} />

    <h2 id="product-page">Build a Mac product page, not a stretched phone page</h2>
    <p>A Mac prospect wants evidence about a desktop workflow: what the window contains, how much context stays visible, what keyboard and pointer use feel like, how files or sync behave, and whether the app belongs beside the tools they already use.</p>
    <h3>Mac screenshots</h3>
    <p>Apple currently accepts 1–10 Mac screenshots. They must use a 16:10 aspect ratio, contain no transparency, and use one of these exact pixel dimensions:</p>
    <div className="dimension-row" aria-label="Accepted Mac screenshot sizes">{macScreenshotSizes.map((size) => <span key={size}>{size}</span>)}</div>
    <LaunchChecklist items={[
      { title: "Lead with the desktop promise", detail: "Show the main window at a readable scale and make the outcome clear without relying on tiny UI." },
      { title: "Prove the working surface", detail: "Use a real, credible state that reveals navigation, information density, or the canvas." },
      { title: "Show native interaction", detail: "Include the Mac value that matters: multiple windows, keyboard flow, menus, drag and drop, files, or pointer precision." },
      { title: "Connect the ecosystem", detail: "If it is true, show how the Mac experience continues work from iPhone or iPad without implying functionality you do not ship." },
      { title: "Close on trust", detail: "Use the final frame for privacy, offline ownership, purchase continuity, or another concrete decision-making proof." },
    ]} />
    <p>App previews are optional. Apple allows up to three per supported display size and language; macOS previews must be landscape. A preview should demonstrate interaction that a still image cannot explain—not repeat the screenshot captions with motion.</p>
    <h3>Mac metadata and ASO</h3>
    <p>The app name and subtitle are app-level information, while the platform version contains its description, promotional text, keywords, support URL, marketing URL, version details, and creative. Write the Mac description in desktop language: sessions, windows, documents, keyboard flow, and continuity where those claims are real. Avoid presenting the Mac listing as a footnote to the iPhone app.</p>
    <p>Choose the Mac primary and secondary categories for genuine product fit. Apple also requires the macOS category selected in App Store Connect to match the category configured in the Xcode project.</p>
    <MetadataLimits />
    <WorkbenchLink>Draft the Mac listing in the private workbench</WorkbenchLink>

    <h2 id="quality">Prove desktop quality before the store page promises it</h2>
    <p>App Sandbox is required for Mac App Store distribution. Configure only the entitlements the product needs, then exercise the signed release build against the real file, network, account, purchase, notification, and data paths those entitlements affect.</p>
    <LaunchChecklist items={[
      { title: "Test supported Macs", detail: "Use real supported hardware where possible, not only a debug build on the primary development machine." },
      { title: "Test window life cycles", detail: "Open, resize, minimize, restore, close, relaunch, and use multiple windows if the product supports them." },
      { title: "Test every input path", detail: "Keyboard navigation, shortcuts, pointer states, menus, scrolling, focus, drag and drop, and text editing should feel intentional." },
      { title: "Test continuity and migration", detail: "Verify sign-in, sync, local files, entitlements, subscription access, and restoration from the existing iOS customer state." },
      { title: "Test accessibility by task", detail: "Complete common workflows using the accessibility features you intend to declare for Mac, not merely a component checklist." },
      { title: "Run TestFlight", detail: "TestFlight for Mac requires a supported Xcode toolchain. External testing can include up to 10,000 testers; the first external build needs beta review and builds expire after 90 days." },
    ]} />
    <p>App privacy answers are app-level and should represent data practices across every platform. Re-audit them when Mac adds new file access, diagnostics, accounts, third-party SDK behavior, or data collection. Accessibility labels are device-specific; declare the Mac experience based on what common Mac tasks actually support.</p>
    <PlatformSources items={[appleSources.sandbox, appleSources.testflight, appleSources.privacy, appleSources.accessibility, appleSources.devices]} />

    <h2 id="review-release">Give App Review a reproducible path</h2>
    <p>Each platform version is submitted separately. Attach the Mac build to the macOS version, add the version to review, and submit it. Review notes should remove uncertainty: give a working account, state where a reviewer finds the primary workflow, explain entitlements or unusual file access, list purchase products to exercise, and describe any dependency on the iPhone or iPad app.</p>
    <Callout tone="note" title="Public copy and review notes have different jobs"><p>The product page should explain value to a customer. Review notes should explain implementation details a reviewer needs to validate the build. Do not make either audience decode the other audience’s language.</p></Callout>
    <p>Choose the release method deliberately and verify price, tax category, territories, agreements, and availability. Apple notes that an approved release can take up to 24 hours to appear.</p>
    <PlatformSources items={[appleSources.submit, appleSources.reviewOverview, appleSources.publishing]} />

    <h2 id="measure">Measure whether the Mac promise holds</h2>
    <p>Watch product-page conversion by source and territory, but do not stop at the download. Segment activation, purchase restoration, subscription access, retained use, review themes, support contacts, and crashes by platform and app version. A Mac launch is successful when the store page attracts people whose desktop job the product can keep serving.</p>
    <div className="next-actions"><Link href="/apple-platforms/universal-purchase/"><span>Need the architecture?</span><strong>Read Universal Purchase →</strong></Link><Link href="/apple-platforms/app-store-launch-requirements/"><span>Preparing assets?</span><strong>Compare requirements →</strong></Link><Link href="/aso-checklist/"><span>Ready to submit?</span><strong>Run the checklist →</strong></Link></div>
  </>;
}

function UniversalPurchaseGuide() {
  return <>
    <h2 id="mental-model">One storefront relationship, multiple platform deliveries</h2>
    <p>Universal Purchase connects related Apple-platform apps through one App Store Connect record. Customers can discover the platform versions as one app relationship, and eligible in-app purchases can be shared. It does not mean one binary, one screenshot set, or one undifferentiated product experience.</p>
    <div className="record-map" aria-label="Universal Purchase app record model"><div><span>App record</span><strong>Shared identity & commerce</strong></div><i aria-hidden="true"/><section><span>iOS build</span><strong>iPhone + iPad</strong></section><section><span>macOS build</span><strong>Native or Catalyst</strong></section></div>
    <Callout tone="official" title="Apple’s definition"><p>A Universal Purchase uses one app record for related platform apps. The apps share a bundle ID while platform-specific information is maintained for each platform.</p></Callout>

    <h2 id="before-you-start">Make the decisions that cannot be repaired later</h2>
    <LaunchChecklist items={[
      { title: "Confirm the customer promise", detail: "Decide whether one purchase should unlock the related iPhone, iPad, and Mac experiences." },
      { title: "Use the existing app record", detail: "Add macOS to the iOS app record when building the Universal Purchase relationship." },
      { title: "Align the bundle identifier", detail: "Apple requires the same bundle ID for the related platform versions." },
      { title: "Avoid separate records", detail: "Existing records cannot be merged later. Stop before creating a second record if one relationship is the goal." },
      { title: "Plan the durable result", detail: "Once at least two platform versions are approved, Apple says the Universal Purchase remains and a platform version cannot be removed." },
    ]} />
    <PlatformSources items={[appleSources.addPlatforms, appleSources.universalPurchase]} />

    <h2 id="shared-and-specific">Know what is shared and what deserves platform work</h2>
    <SpecGrid label="Universal Purchase shared and platform-specific information" items={[
      { label: "App identity", values: [{ label: "Shared record", value: "Apple ID, SKU, bundle ID, app-level name and subtitle" }, { label: "Platform delivery", value: "Separate target, build, version, and release cadence" }] },
      { label: "Store page", values: [{ label: "Shared context", value: "Brand identity and the product relationship" }, { label: "Platform proof", value: "Description, promotional text, screenshots, previews, and version details should fit the device" }] },
      { label: "Trust", values: [{ label: "App level", value: "Privacy answers must cover all platform behavior" }, { label: "Per device", value: "Accessibility support is assessed and declared by device" }] },
    ]} />
    <p>When macOS is added, Apple transfers most existing app information but calls out promotional text, description, and screenshots as information to supply for the new platform. Treat that as a useful minimum, not permission to leave the Mac page generic.</p>

    <h2 id="purchases">Plan purchases, existing users, and replacement behavior</h2>
    <p>In-app purchases configured under one app can be shared across its iOS and macOS platform versions. That continuity depends on your implementation: verify product identifiers, receipt and transaction handling, account state, restoration, family or subscription behavior, and the copy explaining access.</p>
    <Callout tone="caution" title="The Apple silicon transition"><p>If the iPhone or iPad app is available on Apple silicon Macs and you later release a macOS platform version, the Mac app replaces the iOS-on-Mac version. Existing users receive it as an update. Test migration as an existing customer, not only as a fresh install.</p></Callout>
    <PlatformSources items={[appleSources.purchases, appleSources.iosOnMac]} />

    <h2 id="checklist">Universal Purchase implementation checklist</h2>
    <LaunchChecklist items={[
      { title: "Record", detail: "Add macOS to the existing record; verify Apple ID, SKU, bundle ID, roles, agreements, and availability." },
      { title: "Builds", detail: "Use separate targets and platform-appropriate versions; keep an internal release map when numbers diverge." },
      { title: "Commerce", detail: "Exercise purchase, restore, subscription status, refunds, and account access on every platform." },
      { title: "Data", detail: "Test sync, migration, local storage, file ownership, conflicts, and offline recovery for existing users." },
      { title: "Listings", detail: "Write and design proof for each device rather than duplicating the iPhone product page." },
      { title: "Review", detail: "Submit platform versions separately and give reviewers a reproducible cross-platform test path." },
      { title: "Support", detail: "Prepare help content and diagnostics that identify platform, version, build, purchase state, and migration path." },
    ]} />
    <div className="next-actions"><Link href="/apple-platforms/macos-app-store-launch/"><span>Adding a Mac app?</span><strong>Plan the Mac launch →</strong></Link><Link href="/apple-platforms/iphone-app-store-launch/"><span>Shipping iPhone?</span><strong>Open the iPhone guide →</strong></Link><Link href="/apple-platforms/ipad-app-store-launch/"><span>Supporting iPad?</span><strong>Open the iPad guide →</strong></Link></div>
  </>;
}

function IPhoneGuide() {
  return <>
    <h2 id="foundation">Build the launch foundation before writing copy</h2>
    <p>Create the App Store Connect record early enough to discover account, agreement, identifier, privacy, age-rating, pricing, tax, territory, and role problems before release day. The listing can only promise what the signed build reliably delivers.</p>
    <DecisionPath items={[
      { label: "Audience", title: "Name the first customer", detail: "Write down the person, situation, and job the first release serves. “Everyone” cannot guide a launch page." },
      { label: "Promise", title: "Choose one outcome", detail: "The name, subtitle, first screenshot, and onboarding should reinforce one honest reason to install." },
      { label: "Proof", title: "Collect real product states", detail: "Prepare believable data, permissions, edge cases, purchase access, and support paths before capture day." },
    ]} />
    <p>Privacy answers should represent the released app and its SDKs. Accessibility labels should be based on completing common tasks on the device, not on the presence of isolated accessible controls.</p>

    <h2 id="metadata">Write an App Store listing with distinct jobs</h2>
    <MetadataLimits />
    <p>Use the app name for a distinctive identity and essential context, the subtitle for a clear use or outcome, and the private keyword field for relevant search language not already carried efficiently elsewhere. Promotional text is conversion copy that can change without a new app version; Apple does not describe it as a search-ranking field.</p>
    <p>The description should open with the app, audience, and concrete outcome, then explain the real workflow and inspectable features. Avoid keyword repetition, implementation vocabulary, unverifiable superlatives, and promises the first session cannot keep.</p>
    <WorkbenchLink>Draft and count the iPhone metadata</WorkbenchLink>

    <h2 id="creative">Make the screenshot sequence a one-second argument</h2>
    <p>Apple allows 1–10 screenshots per supported display size and localization. Under the current screenshot specification, an iPhone app needs at least one screenshot for the required “iPhone with Dynamic Island (medium display)” set. If the app supports iPad, the required iPad set also applies.</p>
    <LaunchChecklist items={[
      { title: "Frame 1 — the outcome", detail: "Name the primary value in language a qualified customer can recognize immediately." },
      { title: "Frame 2 — the mechanism", detail: "Show the core product interaction with enough real UI to make the claim credible." },
      { title: "Frame 3 — the differentiator", detail: "Prove the behavior or quality that makes this product meaningfully different." },
      { title: "Frames 4–6 — the objections", detail: "Answer the questions that block install: setup, depth, privacy, compatibility, ownership, or continuity." },
      { title: "Final frame — the right next step", detail: "Close with trust or breadth, not a generic download command." },
    ]} />
    <Callout tone="official" title="Do not confuse current and future requirements"><p>Apple’s screenshot specification describes iPhone Duo dimensions for apps built with the iOS 27.1 SDK or later and dates that requirement to April 2027. Label it as upcoming until it applies to the build you are shipping.</p></Callout>
    <p>App previews are optional, with up to three per supported device size and language. Use video when motion, gesture, sequence, or transformation materially improves understanding. Design it to work from the first frame and without sound.</p>
    <PlatformSources items={[appleSources.screenshots, appleSources.previews]} />

    <h2 id="quality">Validate the product-page promise in the release build</h2>
    <LaunchChecklist items={[
      { title: "Test compatible devices", detail: "Exercise the signed release build on real supported devices and current operating systems where practical." },
      { title: "Test first-run reality", detail: "Fresh install, permissions denied, poor network, empty states, sign-in, purchase, restore, and offline behavior should all be coherent." },
      { title: "Audit every claim", detail: "Match names, screenshots, captions, subscription terms, privacy statements, and feature availability to the shipped build." },
      { title: "Use TestFlight deliberately", detail: "Give testers jobs and questions; do not treat a large invite list as evidence of coverage." },
      { title: "Prepare review access", detail: "Supply a working account, exact steps, hardware dependencies, gated features, and purchase context in review notes." },
    ]} />

    <h2 id="submission">Submit and release without an avoidable surprise</h2>
    <p>Attach the build, complete required version information, add the version to review, then submit it. Reconfirm agreements, pricing, tax category, territories, export compliance, content rights, age rating, privacy, and release method. Apple notes that approved releases can take up to 24 hours to appear.</p>
    <PlatformSources items={[appleSources.submit, appleSources.publishing, appleSources.devices, appleSources.privacy]} />

    <h2 id="learning">Read the launch as a connected journey</h2>
    <p>Track impressions and product-page conversion by source, territory, device, and version—but read them beside onboarding completion, activation, purchase quality, retention, reviews, refunds, support, and crashes. A higher install rate is not a win when the listing recruits the wrong expectation.</p>
    <p>Once the baseline is stable, use Product Page Optimization for a bounded test of the default product page and custom product pages for genuinely different audience promises. Treat App Store tags as Apple’s taxonomy—not as copy you can force—and ask for ratings only after an earned moment in the product.</p>
    <div className="next-actions"><Link href="/guides/screenshots/"><span>Designing creative?</span><strong>Build the screenshot argument →</strong></Link><Link href="/guides/keyword-research/"><span>Mapping demand?</span><strong>Research without fake precision →</strong></Link><Link href="/aso-checklist/"><span>Ready to ship?</span><strong>Run the checklist →</strong></Link></div>
  </>;
}

function IPadGuide() {
  return <>
    <h2 id="relationship">iPad belongs to the iOS platform version</h2>
    <p>In App Store Connect, you do not add iPad as a separate platform. iPhone and iPad share the iOS platform version and its core listing information. Supporting iPad does create device-specific creative requirements and a higher bar for the product experience.</p>
    <Callout tone="official" title="Current screenshot requirement"><p>When an app supports iPad, Apple’s current screenshot specification requires at least one 13-inch iPad screenshot. You may provide up to ten per device size and localization.</p></Callout>
    <p>This shared model makes consistency easy, but sameness dangerous. The iPad prospect should not have to infer tablet value from a portrait phone composition.</p>

    <h2 id="product">Earn the big canvas</h2>
    <DecisionPath items={[
      { label: "Layout", title: "Use space with intent", detail: "Reveal more context or reduce mode switching. Do not simply enlarge controls and margins." },
      { label: "Windows", title: "Survive resizing", detail: "Test every supported size, orientation, split arrangement, and window state with real content." },
      { label: "Input", title: "Respect touch and precision", detail: "Touch remains primary, while keyboard, pointer, trackpad, drag and drop, and shortcuts should improve serious work." },
    ]} />
    <p>Decide which iPad jobs are genuinely stronger than the iPhone version: overview, comparison, creation, review, presentation, research, or extended focus. Those are candidates for both product investment and store proof.</p>

    <h2 id="creative">Build an iPad-native visual argument</h2>
    <LaunchChecklist items={[
      { title: "Show the canvas", detail: "Lead with a recognizable full iPad layout rather than floating a phone-shaped crop inside a large frame." },
      { title: "Prove information architecture", detail: "Use a credible state that shows navigation, hierarchy, and why the larger display reduces work." },
      { title: "Show a tablet job", detail: "Demonstrate comparison, multitasking, creation, keyboard flow, pointer precision, or another behavior that matters on iPad." },
      { title: "Keep type readable", detail: "A large source image can still become illegible in the store. Judge every frame at actual browse size." },
      { title: "Localize the composition", detail: "Plan for longer strings and different line breaks; do not trap captions inside a brittle template." },
    ]} />
    <p>The shared app name, subtitle, and iOS description still need to make sense for both iPhone and iPad. Use the device-specific screenshot set to express iPad value that the shared fields cannot carry alone.</p>
    <PlatformSources items={[appleSources.appInformation, appleSources.versionInformation, appleSources.screenshots]} />

    <h2 id="quality">Test like an iPad user, not an enlarged iPhone user</h2>
    <LaunchChecklist items={[
      { title: "Resize continuously", detail: "Watch hierarchy, truncation, focus, overlays, sheets, navigation, and empty states throughout supported window sizes." },
      { title: "Change orientation", detail: "Preserve the task, selection, scroll position, text input, media, and transient state through rotation." },
      { title: "Use keyboard and pointer", detail: "Verify focus order, hover, context menus, selection, shortcuts, escape behavior, and discoverability." },
      { title: "Work beside another app", detail: "Test supported multitasking arrangements, memory pressure, clipboard, drag and drop, and interrupted workflows." },
      { title: "Complete accessible tasks", detail: "Assess the common iPad workflows for every accessibility feature you declare for that device." },
      { title: "Test the signed build", detail: "Use representative physical iPads where possible, including the minimum supported OS and constrained conditions." },
    ]} />
    <PlatformSources items={[appleSources.devices, appleSources.accessibility, appleSources.testflight]} />

    <h2 id="launch">Launch and learn by device</h2>
    <p>Submit the shared iOS version with all required iPhone and iPad information complete. In review notes, explain iPad-only behaviors, multitasking or hardware requirements, and the route to any gated functionality.</p>
    <p>After release, separate iPad outcomes where your analytics and App Store Connect views allow it. Watch acquisition, activation, task completion, retention, subscriptions, support themes, crashes, memory pressure, and reviews. The useful question is not “Did iPad conversion rise?” but “Did the iPad page recruit people for a job the iPad product performs well?”</p>
    <div className="next-actions"><Link href="/apple-platforms/iphone-app-store-launch/"><span>Sharing an iOS launch?</span><strong>Open the iPhone guide →</strong></Link><Link href="/guides/screenshots/"><span>Planning the sequence?</span><strong>Use the screenshot guide →</strong></Link><Link href="/apple-platforms/app-store-launch-requirements/"><span>Checking delivery?</span><strong>Compare all platforms →</strong></Link></div>
  </>;
}

function RequirementsGuide() {
  return <>
    <h2 id="comparison">iPhone, iPad, and Mac at a glance</h2>
    <div className="table-scroll"><table><thead><tr><th>Requirement</th><th>iPhone</th><th>iPad</th><th>Mac</th></tr></thead><tbody>{platformComparison.map((row) => <tr key={row.topic}><th scope="row">{row.topic}</th><td>{row.iphone}</td><td>{row.ipad}</td><td>{row.mac}</td></tr>)}</tbody></table></div>
    <Callout tone="note" title="Use this as a map, not a substitute for App Store Connect"><p>Requirements change and the console responds to the build you upload. Follow the linked Apple specification before submission-sensitive delivery.</p></Callout>

    <h2 id="metadata">The metadata model</h2>
    <p>App Store Connect holds both app-level information and platform-version information. The app name and subtitle are app-level, with current 30-character limits. Each platform version contains its own release and product-page information such as screenshots, app previews, promotional text, description, keywords, support URL, marketing URL, version, copyright, What’s New text, and review notes.</p>
    <SpecGrid label="App Store metadata layers" items={[
      { label: "App level", values: [{ label: "Identity", value: "Name, subtitle, bundle relationship, categories" }, { label: "Trust", value: "Privacy answers should cover every platform" }] },
      { label: "iOS version", values: [{ label: "Delivery", value: "One iOS platform version supports iPhone and iPad" }, { label: "Creative", value: "Device-specific screenshot and preview sets" }] },
      { label: "macOS version", values: [{ label: "Delivery", value: "Added as a platform with its own build" }, { label: "Creative", value: "Mac description, promotional text, screenshots, and optional previews" }] },
    ]} />
    <MetadataLimits />

    <h2 id="screenshots">Current screenshot requirements</h2>
    <ul>
      <li><strong>Count:</strong> Apple accepts 1–10 screenshots per applicable device size and localization.</li>
      <li><strong>File type:</strong> JPEG, JPG, or PNG, without alpha transparency.</li>
      <li><strong>iPhone:</strong> at least one screenshot in the current required “iPhone with Dynamic Island (medium display)” set.</li>
      <li><strong>iPad:</strong> a 13-inch iPad screenshot is required when the app supports iPad.</li>
      <li><strong>Mac:</strong> a required 16:10 screenshot using {macScreenshotSizes.join(", ")}.</li>
    </ul>
    <Callout tone="caution" title="Upcoming iPhone Duo rule"><p>Apple lists outer and inner Duo screenshot dimensions for apps built with the iOS 27.1 SDK or later, with the requirement beginning in April 2027. It is future guidance as of this page’s October 2026 review date.</p></Callout>
    <PlatformSources items={[appleSources.screenshots]} />

    <h2 id="previews">App preview requirements</h2>
    <p>App previews are optional. Apple permits up to three per supported device size and language. Mac app previews must be landscape. Preview availability and accepted delivery details depend on the device and App Store Connect context, so validate the final upload there.</p>
    <PlatformSources items={[appleSources.previews]} />

    <h2 id="submission">Builds and submissions remain platform-specific</h2>
    <p>iPhone and iPad ship through the iOS platform version. A related Mac app uses a macOS platform version and separate build. Apple allows one app-version submission per platform at a time; items for different platforms are not combined into one submission.</p>
    <p>For Universal Purchase, use the same app record and bundle ID. Platform version and build numbers may differ. After approval on at least two platforms, Apple says the Universal Purchase remains and the platform version cannot be removed.</p>
    <PlatformSources items={[appleSources.addPlatforms, appleSources.reviewOverview, appleSources.submit]} />

    <h2 id="sources">Primary Apple sources</h2>
    <p>These are the pages to recheck before a launch. The surrounding guides translate them into working decisions without hiding the source.</p>
    <PlatformSources items={Object.values(appleSources)} />
    <div className="next-actions"><Link href="/apple-platforms/macos-app-store-launch/"><span>Shipping Mac?</span><strong>Open the Mac guide →</strong></Link><Link href="/apple-platforms/iphone-app-store-launch/"><span>Shipping iPhone?</span><strong>Open the iPhone guide →</strong></Link><Link href="/apple-platforms/ipad-app-store-launch/"><span>Supporting iPad?</span><strong>Open the iPad guide →</strong></Link></div>
  </>;
}
