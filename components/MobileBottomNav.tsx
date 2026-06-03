"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  currentUserId: string;
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="22"
      height="22"
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

export function MobileBottomNav({ currentUserId }: MobileBottomNavProps) {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/feed", match: "/feed", d: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m6 0h3a1 1 0 001-1V10M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6" },
    { label: "Search", href: "/search", match: "/search", d: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" },
    { label: "Saved", href: "/bookmarks", match: "/bookmarks", d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
    { label: "Profile", href: `/profile/${currentUserId}`, match: `/profile/${currentUserId}`, d: "M5.121 17.804A13 13 0 0112 15c2.5 0 4.847.7 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t flex items-stretch"
      style={{ background: "#22393c", borderColor: "rgba(255,255,255,0.08)" }}
    >
      {items.map((item) => {
        const active = pathname === item.match;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5"
            style={{ color: active ? "#afbb98" : "rgba(255,255,255,0.6)" }}
          >
            <Icon d={item.d} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
