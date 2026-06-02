"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface NavBarProps {
  userName: string | null;
  role: string;
}

export function NavBar({ userName, role }: NavBarProps) {
  const isAdmin = role === "admin";

  return (
    <nav
      className="sticky top-0 z-10 border-b"
      style={{
        background: "#22393c",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-[960px] mx-auto px-4 h-14 flex items-center justify-between">
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

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/feed"
            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Feed
          </Link>

          <Link
            href="/members"
            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Members
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: "#afbb98",
                background: "rgba(175,187,152,0.12)",
              }}
            >
              Admin Dashboard
            </Link>
          )}

          {/* Avatar initials */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ml-1"
            style={{
              background: "linear-gradient(135deg, #46707e, #3d6672)",
              color: "white",
              fontFamily: "var(--font-inter)",
            }}
            title={userName ?? "Account"}
          >
            {userName
              ? userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "?"}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
