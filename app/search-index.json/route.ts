import { buildSearchIndex } from "@/lib/searchIndex";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
