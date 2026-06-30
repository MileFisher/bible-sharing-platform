import { NextResponse } from "next/server";
import { fetchVerse } from "@/lib/bible";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref")?.trim();
  const translation = searchParams.get("translation");

  if (!ref) {
    return NextResponse.json({ error: "Missing ref parameter" }, { status: 400 });
  }

  if (translation !== "CUV" && translation !== "WEB") {
    return NextResponse.json(
      { error: "translation must be CUV or WEB" },
      { status: 400 }
    );
  }

  const result = await fetchVerse(ref, translation);

  if (!result) {
    return NextResponse.json({ error: "Verse not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
