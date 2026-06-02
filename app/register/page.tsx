"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // No token in the URL — registration is invite-only
  if (!token) {
    return (
      <div className="card p-10 max-w-md w-full mx-4 text-center">
        <h1
          className="text-[28px] font-semibold mb-3"
          style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
        >
          Invitation Required
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
        >
          Scripture is invite-only. You need a valid invitation link from your
          church administrator to create an account.
        </p>
        <Link href="/feed" className="btn-ghost inline-block">
          Back to Feed
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Registration failed.");
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Account created but sign-in failed — send them to the sign-in page
        router.push("/auth/signin");
        return;
      }

      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card p-8 max-w-md w-full mx-4">
      <h1
        className="text-[32px] font-semibold mb-2 tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-playfair)", color: "#22393c" }}
      >
        Create your account
      </h1>
      <p
        className="text-sm mb-6"
        style={{ fontFamily: "var(--font-inter)", color: "#7a9198" }}
      >
        Join your community and start sharing reflections.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5"
            style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="input-field w-full"
            autoComplete="name"
          />
        </div>

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
            placeholder="At least 8 characters"
            className="input-field w-full"
            autoComplete="new-password"
            minLength={8}
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p
        className="text-xs text-center mt-6"
        style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
      >
        Already have an account?{" "}
        <Link href="/auth/signin" style={{ color: "#46707e", fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f4f3ec" }}
    >
      <Suspense
        fallback={
          <p style={{ color: "#7a9198" }}>Loading…</p>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
