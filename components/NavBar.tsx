"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import type { Lang } from "@/lib/i18n";
import { updateLanguage } from "@/lib/actions";

interface NavBarProps {
  userId: string;
  userName: string | null;
  role: string;
  lang?: Lang;
}

export function NavBar({ userId, userName, lang = "zh" }: NavBarProps) {
  const router = useRouter();
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
      router.refresh();
    });
  }

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

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div
            className="flex rounded-[6px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={() => handleLanguageSwitch("zh")}
              disabled={isPending}
              className="px-2 py-1 text-[10px] font-semibold transition-colors"
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
              className="px-2 py-1 text-[10px] font-semibold transition-colors"
              style={{
                background: optimisticLang === "en" ? "#46707e" : "transparent",
                color: optimisticLang === "en" ? "#faf9f6" : "rgba(255,255,255,0.5)",
              }}
            >
              EN
            </button>
          </div>

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
      </div>
    </nav>
  );
}
