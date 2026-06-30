import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";
import { LeftSidebar } from "@/components/LeftSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import type { Lang } from "@/lib/i18n";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="min-h-screen" style={{ background: "#f4f3ec" }}>
        <nav
          className="sticky top-0 z-10 border-b"
          style={{
            background: "#22393c",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="max-w-[960px] mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/feed"
              className="text-[18px] font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#faf9f6" }}
            >
              Script<span style={{ color: "#afbb98" }}>ura</span>
            </Link>
            <Link
              href="/auth/signin"
              className="text-[13px] font-medium px-3 py-1.5 rounded-lg"
              style={{ color: "#afbb98" }}
            >
              Sign in
            </Link>
          </div>
        </nav>
        {children}
      </div>
    );
  }

  const userName = session.user.name ?? session.user.email ?? null;
  const lang: Lang = session.user.language === "en" ? "en" : "zh";

  return (
    <div className="min-h-screen" style={{ background: "#f4f3ec" }}>
      {/* Mobile top bar (hidden on lg) */}
      <NavBar
        userId={session.user.id}
        userName={userName}
        role={session.user.role}
        lang={lang}
      />

      <div className="lg:flex lg:max-w-[1280px] lg:mx-auto">
        {/* Desktop left rail */}
        <aside className="hidden lg:block lg:w-[220px] lg:shrink-0">
          <div className="sticky top-0 h-screen">
            <LeftSidebar
              currentUserId={session.user.id}
              userName={userName}
              role={session.user.role}
              lang={lang}
            />
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav currentUserId={session.user.id} />
    </div>
  );
}
