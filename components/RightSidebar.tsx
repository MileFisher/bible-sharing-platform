import Link from "next/link";
import { prisma } from "@/lib/db";
import { verseOfTheDay, fetchVerse } from "@/lib/bible";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** ① Verse of the Day — fetches live text from Bolls API in user's language. */
export async function VerseOfTheDay({ lang = "zh" }: { lang?: Lang }) {
  const strings = getT(lang);
  const verse = verseOfTheDay();
  const translation = lang === "zh" ? "CUV" : "WEB";

  // Try to fetch live verse text; fall back to hardcoded English.
  const fetched = await fetchVerse(verse.ref, translation);
  const displayText = fetched?.text ?? verse.text;

  return (
    <div
      className="rounded-[14px] p-5"
      style={{ background: "#22393c", color: "#faf9f6" }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3"
        style={{ color: "#afbb98", fontFamily: "var(--font-inter)" }}
      >
        {strings.verseOfTheDay}
      </p>
      <p
        className="text-[17px] italic leading-snug mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        &ldquo;{displayText}&rdquo;
      </p>
      <p
        className="text-[13px]"
        style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)" }}
      >
        {verse.ref}
      </p>
    </div>
  );
}

/** ② Trending Verses — top referenced passages over the last 7 days. */
export async function TrendingVerses({ lang = "zh" }: { lang?: Lang }) {
  const strings = getT(lang);
  const since = new Date(Date.now() - SEVEN_DAYS_MS);

  const grouped = await prisma.post.groupBy({
    by: ["verseRef"],
    where: { createdAt: { gte: since }, deleted: false, verseRef: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { verseRef: "desc" } },
    take: 5,
  });

  const totalNotes = await prisma.post.count({
    where: { createdAt: { gte: since }, deleted: false, verseRef: { not: null } },
  });

  return (
    <div className="card p-5" id="trending">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4 text-[#7a9198]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {strings.trendingVerses}
      </p>

      {grouped.length === 0 ? (
        <p className="text-sm italic text-[#7a9198]">
          {strings.noTrending}
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {grouped.map((row, i) => {
            const count = row._count._all;
            const pct =
              totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
            return (
              <li key={row.verseRef} className="flex items-center gap-3">
                <span
                  className="text-[15px] font-bold w-4 text-center shrink-0"
                  style={{ fontFamily: "var(--font-playfair)", color: "#46707e" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#22393c] truncate">
                    {row.verseRef}
                  </p>
                  <p className="text-xs text-[#7a9198]">
                    {count} {strings.notes}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: "rgba(107,139,129,0.15)", color: "#5a7a6e" }}
                >
                  ▲ {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** ③ Active Members — most prolific authors over the last 7 days. */
export async function ActiveMembers({ lang = "zh" }: { lang?: Lang }) {
  const strings = getT(lang);
  const since = new Date(Date.now() - SEVEN_DAYS_MS);

  const grouped = await prisma.post.groupBy({
    by: ["authorId"],
    where: { createdAt: { gte: since }, deleted: false },
    _count: { _all: true },
    orderBy: { _count: { authorId: "desc" } },
    take: 8,
  });

  const ids = grouped.map((g) => g.authorId);
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((u): u is { id: string; name: string | null } => Boolean(u));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a9198]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {strings.activeMembers}
        </p>
        <Link href="/members" className="text-xs font-medium text-[#46707e]">
          {strings.allMembers}
        </Link>
      </div>

      {ordered.length === 0 ? (
        <p className="text-sm italic text-[#7a9198]">{strings.noActivity}</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {ordered.map((u) => (
            <Link
              key={u.id}
              href={`/profile/${u.id}`}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, #46707e, #3d6672)",
                  color: "white",
                  fontFamily: "var(--font-inter)",
                }}
                aria-hidden="true"
              >
                {initials(u.name)}
              </div>
              <span className="text-[10px] text-[#7a9198] text-center truncate w-full group-hover:text-[#46707e]">
                {u.name ?? "Anonymous"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** Composed right sidebar used on the feed. */
export function RightSidebar({ lang = "zh" }: { lang?: Lang }) {
  return (
    <aside className="flex flex-col gap-5">
      <VerseOfTheDay lang={lang} />
      <TrendingVerses lang={lang} />
      <ActiveMembers lang={lang} />
    </aside>
  );
}
