import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen" style={{ background: "#f4f3ec" }}>
      {session?.user ? (
        <NavBar
          userId={session.user.id}
          userName={session.user.name ?? session.user.email ?? null}
          role={session.user.role}
        />
      ) : (
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
      )}

      {children}
    </div>
  );
}
