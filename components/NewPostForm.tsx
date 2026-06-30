"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

interface NewPostFormProps {
  lang: Lang;
}

export function NewPostForm({ lang }: NewPostFormProps) {
  const router = useRouter();
  const strings = getT(lang);
  const translation = lang === "zh" ? "CUV" : "WEB";

  const [content, setContent] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verse preview state
  const [verseText, setVerseText] = useState<string | null>(null);
  const [verseLoading, setVerseLoading] = useState(false);
  const [fetchedFor, setFetchedFor] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const contentMax = 2000;
  const isNearLimit = content.length > 1800;

  const fetchVersePreview = useCallback(
    async (ref: string) => {
      const trimmed = ref.trim();
      if (!trimmed) {
        setVerseText(null);
        setFetchedFor("");
        return;
      }
      if (trimmed === fetchedFor) return; // already fetched

      setVerseLoading(true);
      setFetchedFor(trimmed);

      try {
        const res = await fetch(
          `/api/verse?ref=${encodeURIComponent(trimmed)}&translation=${translation}`
        );
        if (!res.ok) {
          setVerseText(null);
          return;
        }
        const data = await res.json();
        setVerseText(data.text ?? null);
      } catch {
        setVerseText(null);
      } finally {
        setVerseLoading(false);
      }
    },
    [translation, fetchedFor]
  );

  function handleVerseRefBlur() {
    fetchVersePreview(verseRef);
  }

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
      setVerseText(null);
      setFetchedFor("");
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
          {strings.verseRef}
        </label>
        <input
          id="verseRef"
          type="text"
          value={verseRef}
          onChange={(e) => {
            setVerseRef(e.target.value);
            // Clear preview when user edits
            if (verseText) {
              setVerseText(null);
              setFetchedFor("");
            }
          }}
          onBlur={handleVerseRefBlur}
          placeholder={strings.verseRefPlaceholder}
          className="input-field w-full"
          style={{ fontFamily: "var(--font-inter)" }}
        />

        {/* Verse preview */}
        {verseLoading && (
          <p
            className="mt-2 text-xs italic text-[#7a9198]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Loading verse…
          </p>
        )}
        {verseText && !verseLoading && (
          <blockquote className="verse-callout mt-3 pl-5 pr-4 py-3">
            <p
              className="text-[15px] italic text-[#3a4f52] leading-relaxed"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {verseText}
            </p>
          </blockquote>
        )}
      </div>

      {/* Content textarea */}
      <div className="mb-3">
        <label
          htmlFor="content"
          className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a9198] mb-1.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {strings.shareNote}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={strings.contentPlaceholder}
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
          {isSubmitting ? strings.posting : strings.post}
        </button>
      </div>
    </form>
  );
}
