"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/feed";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "banned"
      ? "Your account has been suspended. Please contact your church administrator."
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="card p-8 max-w-md w-full mx-4">
      <h1
        className="text-[32px] font-semibold mb-2 tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
      >
        Welcome back
      </h1>
      <p
        className="text-sm mb-6"
        style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
      >
        Sign in to continue your reflections.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5"
            style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field w-full"
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5"
            style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="input-field w-full"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p
            className="text-sm"
            style={{ color: "#c0765c", fontFamily: "var(--font-inter)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-2"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p
        className="text-xs text-center mt-6"
        style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
      >
        Have an invitation?{" "}
        <Link href="/register" style={{ color: "#46707e", fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f4f3ec" }}
    >
      <Suspense fallback={<p style={{ color: "#7a9198" }}>Loading…</p>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
