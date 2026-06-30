"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";

interface NavBarProps {
  userId: string;
  userName: string | null;
  role: string;
  lang?: Lang;
}

export function NavBar({ userId, userName }: NavBarProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav
      className="lg:hidden sticky top-0 z-10 border-b"
      style={{
        background: "#22393c",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Logo / wordmark */}
        <Link href="/feed" className="flex items-center gap-2">
          <span
            className="text-[18px] font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#faf9f6" }}
          >
            Script
            <span style={{ color: "#afbb98" }}>ura</span>
          </span>
        </Link>

        {/* Avatar → own profile */}
        <Link
          href={`/profile/${userId}`}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg, #46707e, #3d6672)",
            color: "white",
            fontFamily: "var(--font-inter)",
          }}
          title={userName ?? "Your profile"}
          aria-label="Your profile"
        >
          {initials}
        </Link>
      </div>
    </nav>
  );
}
