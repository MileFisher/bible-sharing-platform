"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function NewPostForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const contentMax = 2000;
  const isNearLimit = content.length > 1800;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          verseRef: verseRef.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create post");
      }

      setContent("");
      setVerseRef("");
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card p-5 mb-6"
    >
      {/* Verse reference input */}
      <div className="mb-4">
        <label
          htmlFor="verseRef"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a9198] mb-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Bible Reference
        </label>
        <input
          id="verseRef"
          type="text"
          value={verseRef}
          onChange={(e) => setVerseRef(e.target.value)}
          placeholder="e.g. John 3:16, Psalm 23, Romans 8…"
          className="input-field w-full"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      {/* Content textarea */}
      <div className="mb-3">
        <label
          htmlFor="content"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a9198] mb-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Your Note
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did this verse reveal to you?"
          rows={4}
          maxLength={contentMax}
          className="input-field w-full resize-y min-h-[120px]"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-inter)",
              color: isNearLimit ? "#c0765c" : "#7a9198",
            }}
          >
            {content.length} / {contentMax}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-[#c0765c] mb-3" style={{ fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn-primary"
        >
          {isSubmitting ? "Publishing…" : "Publish Note"}
        </button>
      </div>
    </form>
  );
}
