"use client";

import { useState } from "react";

export function InviteGenerator() {
  const [registerUrl, setRegisterUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generateInvite() {
    setIsGenerating(true);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/admin/invite", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate invite.");
      }

      setRegisterUrl(data.registerUrl as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    if (!registerUrl) return;
    try {
      await navigator.clipboard.writeText(registerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3
            className="text-[15px] font-semibold"
            style={{ color: "#22393c", fontFamily: "var(--font-inter)" }}
          >
            Invite a new member
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "#7a9198", fontFamily: "var(--font-inter)" }}
          >
            Generate a single-use link to share with someone you want to invite.
          </p>
        </div>
        <button
          onClick={generateInvite}
          disabled={isGenerating}
          className="btn-primary shrink-0"
        >
          {isGenerating ? "Generating…" : "Generate Invite Link"}
        </button>
      </div>

      {error && (
        <p
          className="text-sm mt-4"
          style={{ color: "#c0765c", fontFamily: "var(--font-inter)" }}
        >
          {error}
        </p>
      )}

      {registerUrl && (
        <div
          className="mt-4 flex items-center gap-2 p-3 rounded-xl"
          style={{ background: "var(--morning-clay-light)" }}
        >
          <code
            className="text-xs flex-1 truncate"
            style={{ color: "#3a4f52", fontFamily: "var(--font-inter)" }}
          >
            {registerUrl}
          </code>
          <button
            onClick={copyToClipboard}
            className="text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 transition-colors"
            style={{
              border: "1.5px solid #46707e",
              color: copied ? "#6b9e6b" : "#46707e",
              background: "transparent",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
