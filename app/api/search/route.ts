import { NextResponse } from "next/server";
import { searchAnime } from "@/lib/api";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const res = await searchAnime(q);
  if (!res.ok) {
    return NextResponse.json({ results: [], error: res.error }, { status: 502 });
  }
  return NextResponse.json(
    { results: res.data.results.slice(0, 8) },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
