import { NextResponse } from "next/server";
import { sendLineMessage } from "@/lib/line";

/**
 * Daily reminder cron job.
 * Triggered by Vercel Cron Jobs at 8:00 AM Bangkok time (01:00 UTC).
 *
 * Protected by the CRON_SECRET header — only Vercel's cron scheduler
 * (or a caller with the shared secret) may invoke this endpoint.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;

  // Require a shared secret so only Vercel's cron can call this
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const expected = `Bearer ${cronSecret}`;

    if (authHeader !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const siteUrl = process.env.NEXTAUTH_URL ?? "https://your-domain.vercel.app";

  try {
    await sendLineMessage(
      `🙏 Time to share your Bible reflection today!\n\n` +
        `Open Scripture to write and share what you've discovered:\n` +
        `${siteUrl}/feed`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Daily reminder failed:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const runtime = "nodejs";
