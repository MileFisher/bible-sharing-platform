"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useOptimistic, useTransition } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";
import { updateLanguage } from "@/lib/actions";

interface LeftSidebarProps {
  currentUserId: string;
  userName: string | null;
  role: string;
  lang?: Lang;
  /** Static unread count for the Feed badge (placeholder for now). */
  unreadCount?: number;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  /** Match this exact pathname for the active highlight. */
  match?: string;
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function LeftSidebar({
  currentUserId,
  userName,
  role,
  lang = "zh",
  unreadCount = 3,
}: LeftSidebarProps) {
  const pathname = usePathname();
  const strings = getT(lang);
  const isAdmin = role === "admin";

  const [optimisticLang, setOptimisticLang] = useOptimistic(
    lang,
    (_current, next: Lang) => next
  );
  const [isPending, startTransition] = useTransition();

  function handleLanguageSwitch(newLang: Lang) {
    if (newLang === optimisticLang) return;
    startTransition(async () => {
      setOptimisticLang(newLang);
      await updateLanguage(newLang);
    });
  }

  const primary: NavItem[] = [
    {
      label: strings.feed,
      href: "/feed",
      match: "/feed",
      badge: unreadCount,
      icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      label: strings.myNotes,
      href: `/profile/${currentUserId}`,
      match: `/profile/${currentUserId}`,
      icon: <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    },
    {
      label: strings.bookmarks,
      href: "/bookmarks",
      match: "/bookmarks",
      icon: <Icon d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
    },
  ];

  const explore: NavItem[] = [
    {
      label: strings.community,
      href: "/members",
      match: "/members",
      icon: <Icon d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" />,
    },
    {
      label: strings.trending,
      href: "/feed#trending",
      icon: <Icon d="M3 17l6-6 4 4 8-8M21 7v6h-6" />,
    },
    {
      label: strings.readingPlan,
      href: "#",
      icon: <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    },
    {
      label: strings.settings,
      href: "/profile/edit",
      match: "/profile/edit",
      icon: <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
  ];

  const renderItem = (item: NavItem) => {
    const active = item.match !== undefined && pathname === item.match;
    return (
      <Link
        key={item.label}
        href={item.href}
        className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors"
        style={{
          background: active ? "#46707e" : "transparent",
          color: active ? "#faf9f6" : "rgba(255,255,255,0.72)",
        }}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge ? (
          <span
            className="text-[11px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
            style={{ background: "#afbb98", color: "#22393c" }}
          >
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className="flex flex-col h-full p-4"
      style={{ background: "#22393c" }}
    >
      {/* Wordmark */}
      <Link href="/feed" className="flex items-center gap-2 px-2 mb-6 mt-1">
        <span
          className="text-[20px] font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "#faf9f6" }}
        >
          Script<span style={{ color: "#afbb98" }}>ura</span>
        </span>
      </Link>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1">{primary.map(renderItem)}</nav>

      {/* Explore divider */}
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.14em] px-3 mt-6 mb-2"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        Explore
      </p>
      <nav className="flex flex-col gap-1">{explore.map(renderItem)}</nav>

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors mt-1"
          style={{
            background:
              pathname === "/admin" ? "#46707e" : "rgba(175,187,152,0.12)",
            color: pathname === "/admin" ? "#faf9f6" : "#afbb98",
          }}
        >
          <span className="shrink-0">
            <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </span>
          <span className="flex-1">{strings.adminDashboard}</span>
        </Link>
      )}

      {/* Language toggle */}
      <div className="mt-4 px-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {strings.language}
        </p>
        <div
          className="flex rounded-[8px] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => handleLanguageSwitch("zh")}
            disabled={isPending}
            className="flex-1 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: optimisticLang === "zh" ? "#46707e" : "transparent",
              color: optimisticLang === "zh" ? "#faf9f6" : "rgba(255,255,255,0.5)",
            }}
          >
            中文
          </button>
          <button
            onClick={() => handleLanguageSwitch("en")}
            disabled={isPending}
            className="flex-1 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: optimisticLang === "en" ? "#46707e" : "transparent",
              color: optimisticLang === "en" ? "#faf9f6" : "rgba(255,255,255,0.5)",
            }}
          >
            EN
          </button>
        </div>
      </div>

      {/* User card */}
      <Link
        href={`/profile/${currentUserId}`}
        className="mt-auto flex items-center gap-3 px-2 py-3 rounded-[10px] transition-colors hover:bg-[rgba(255,255,255,0.05)]"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
          style={{
            background: "linear-gradient(135deg, #46707e, #3d6672)",
            color: "white",
            fontFamily: "var(--font-inter)",
          }}
          aria-hidden="true"
        >
          {userInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#faf9f6] truncate">
            {userName ?? "You"}
          </p>
          <p className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.5)" }}>
            {role}
          </p>
        </div>
      </Link>

      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.05)]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        <span className="shrink-0">
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </span>
        {strings.signOut}
      </button>
    </div>
  );
}
