export const tools = [
  { slug: "app-store-keyword-field", label: "Apple", title: "App Store keyword field checker", description: "Count the 100-byte Apple keyword field, expose duplicates, and spot space you can reclaim.", action: "Check a keyword field" },
  { slug: "metadata-validator", label: "Apple + Google Play", title: "App store metadata validator", description: "Check the common text limits for an Apple App Store or Google Play listing without uploading your copy.", action: "Validate metadata" },
  { slug: "app-store-screenshot-sizes", label: "Creative", title: "App Store screenshot size reference", description: "Choose a platform and get the current upload constraints, recommendation thresholds, and official source.", action: "Check screenshot sizes" },
  { slug: "experiment-brief", label: "Growth", title: "Store listing experiment brief", description: "Turn an idea into a decision-ready hypothesis, primary measure, guardrail, and learning plan.", action: "Write an experiment brief" },
] as const;
export type ToolSlug = typeof tools[number]["slug"];
export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
