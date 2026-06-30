import Link from "next/link";
import { FEED_TABS, type FeedTab } from "@/lib/bible";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

interface FeedTabsProps {
  activeTab: FeedTab;
  todayCount: number;
  lang?: Lang;
}

const TAB_LABELS: Record<FeedTab, keyof ReturnType<typeof getT>> = {
  all: "allNotes",
  following: "followingTab",
  nt: "newTestament",
  ot: "oldTestament",
  psalms: "psalms",
};

export function FeedTabs({ activeTab, todayCount, lang = "zh" }: FeedTabsProps) {
  const strings = getT(lang);

  return (
    <div className="flex items-center justify-between gap-4 mb-6 border-b border-[#e8e6dc]">
      <div className="flex gap-1 overflow-x-auto">
        {FEED_TABS.map((t) => {
          const active = t.key === activeTab;
          const label = strings[TAB_LABELS[t.key]];
          return (
            <Link
              key={t.key}
              href={`/feed?tab=${t.key}`}
              className="px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
              style={{
                color: active ? "#22393c" : "#7a9198",
                borderColor: active ? "#46707e" : "transparent",
                fontFamily: "var(--font-inter)",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <span className="text-xs text-[#7a9198] whitespace-nowrap shrink-0 hidden sm:block">
        {strings.showingNotes} · {todayCount}
      </span>
    </div>
  );
}
