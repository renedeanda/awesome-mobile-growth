# Editorial policy

Awesome Mobile Growth is an owner-maintained field guide by René DeAnda.

## Evidence hierarchy

1. Current Apple or Google documentation for platform behavior.
2. Directly observed product or store behavior, with date and context.
3. A documented experiment, including limitations.
4. A hypothesis that is explicitly marked for testing.
5. Editorial opinion, plainly labeled.

Every guide has a review date. Volatile limits and policies link to a primary source. A date is not proof that a page is correct; it tells the reader when verification last happened.

When the official documentation is silent or inconsistent (for example, two Apple pages describing the same requirement differently), say so, quote both, and link both. Recent platform changes may also be confirmed through reputable reporting; name the source and link it.

## Voice

Write for someone shipping an app this week. They want the answer, the steps and the number, in that order.

- **Lead with the answer.** The first sentence of a page or section says what to do or what is true. Context comes after.
- **Every section earns its place with something specific:** a limit, a pixel size, a screen path in App Store Connect or Play Console, a worked example, or a mistake you would otherwise make.
- **Show, then explain.** A before-and-after example teaches more than a paragraph of principles. Label invented examples as examples.
- **Use the reader's words.** Say "screenshots", "subtitle" and "install", not internal jargon or abstract nouns.
- **Short sentences, active voice.** One idea per sentence. Cut throat-clearing and summaries of what you just said.
- **No mannered devices.** Avoid em-dash asides, "not X but Y" reframes, colon-then-reveal sentences and scare quotes. State the point directly.
- **Name things consistently.** Sections are Launch, Store page, Grow, Tools, Changes and Learn. Pages are guides.
- **End with action.** Guides close with a short "Do this today" list the reader can finish in one sitting.

### Banned phrases

`npm run audit:content` fails the build when public copy contains any of these. They are either generic filler or habits this site used to overuse.

product truth · truthful promise · honest promise · fake precision · invented certainty · evidence-aware · operating desk · field lab · field manual · working desk · launch desk · decision-focused · decision-ready · visual argument · earned moment · game-changer · unlock the power · ever-evolving · in today's · seamless · leverage · delve · elevate your · empower · holistic · synergy · cutting-edge · best-in-class · world-class · supercharge · worth noting · honest caveat · let's dive · dive into · in conclusion · allergic to · "—not"

The canonical list lives in `scripts/audit-content.mjs`.

## What we do not publish

- Paid placements, affiliate rankings, or link exchanges
- Unsolicited tool listings or promotional guest posts
- Fabricated keyword volume, revenue, conversion rates, or testimonials
- Competitor trademarks in keyword recommendations
- Advice that encourages misleading screenshots or unsupported claims

Numbers published by Apple or Google about their own products (for example, Apple's reported average lift from custom product pages) may be quoted with attribution. They are the platform's claim, not a benchmark for your app.

## AI-assisted editorial work

AI may help structure evidence, identify inconsistencies, generate bounded alternatives, and perform mechanical checks. It is not a source for private ranking behavior, keyword volume, product facts, conversion claims, or platform policy. Generated work must be reviewed against the shipped product, current primary documentation, the original copy, and the intended market before publication.

Public AI skills and examples must be useful to any visitor. They may not expose private repositories, unreleased products, customer data, personal paths, credentials, analytics, or maintainer-only strategy. A live store-console change always requires explicit human authorization.

## Corrections

Factual corrections should identify the precise claim and link to a current primary source. A correction does not create an obligation to list or promote a product.

## First-party disclosure

ProductBuilder, MarkdownNotes.net, and Awesome Mobile Growth share an author. Links between them are marked "Also by the author" and appear only where they help the reader, never as disguised resource recommendations.
