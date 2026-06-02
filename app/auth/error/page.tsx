import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function ErrorContent() {
  // NextAuth passes the error type as a search param
  // We use a client-safe approach with the searchParams prop
  return <ErrorBody />;
}

function ErrorBody() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f4f3ec" }}
    >
      <div className="card p-10 max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(192, 117, 92, 0.12)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c0765c"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          className="text-[28px] font-semibold mb-3"
          style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
        >
          Account Suspended
        </h1>

        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
        >
          Your account has been suspended. If you believe this is a mistake,
          please contact your church administrator.
        </p>

        <Link
          href="/feed"
          className="btn-primary inline-block"
        >
          Back to Feed
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#f4f3ec" }}
        >
          <p style={{ color: "#7a9198" }}>Loading…</p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
