"use client";

import { useState } from "react";

interface CommentAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
}

interface CommentSectionProps {
  postId: string;
  initialCount: number;
  canComment: boolean;
  /** Called whenever the comment count changes so the parent can update its badge. */
  onCountChange?: (count: number) => void;
}

export function CommentSection({
  postId,
  initialCount,
  canComment,
  onCountChange,
}: CommentSectionProps) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(initialCount);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateCount(next: number) {
    setCount(next);
    onCountChange?.(next);
  }

  async function loadComments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      const list: Comment[] = data.comments ?? [];
      setComments(list);
      setLoaded(true);
      updateCount(list.length);
    } catch {
      setError("Couldn't load comments. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) {
      loadComments();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    setError(null);

    // Optimistic comment
    const tempId = `temp-${count}-${content.length}`;
    const optimistic: Comment = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      author: { id: "me", name: "You", image: null },
    };

    setComments((prev) => [...prev, optimistic]);
    updateCount(count + 1);
    setDraft("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to post comment");
      }

      const data = await res.json();
      const saved: Comment = data.comment;
      // Replace the optimistic placeholder with the real comment
      setComments((prev) => prev.map((c) => (c.id === tempId ? saved : c)));
    } catch (err) {
      // Roll back the optimistic comment
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      updateCount(count);
      setDraft(content);
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-[#e8e6dc]">
      <button
        onClick={toggleOpen}
        className="text-xs font-medium transition-colors"
        style={{ color: "#46707e", fontFamily: "var(--font-inter)" }}
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} comment{count !== 1 ? "s" : ""}
        {count > 0 ? ` (${count})` : ""}
      </button>

      {open && (
        <div className="mt-3">
          {loading && (
            <p className="text-xs text-[#7a9198]">Loading comments…</p>
          )}

          {!loading && loaded && comments.length === 0 && (
            <p className="text-xs italic text-[#7a9198] mb-3">
              No comments yet. Be the first to reflect.
            </p>
          )}

          {comments.length > 0 && (
            <ul className="flex flex-col gap-3 mb-3">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #46707e, #3d6672)",
                      color: "white",
                      fontFamily: "var(--font-inter)",
                    }}
                    aria-hidden="true"
                  >
                    {initials(c.author.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#22393c]">
                      {c.author.name ?? "Anonymous"}
                    </p>
                    <p className="text-sm text-[#3a4f52] leading-relaxed whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {canComment && (
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a comment…"
                rows={1}
                maxLength={1000}
                className="flex-1 resize-none rounded-lg border border-[#d8d6ca] bg-white px-3 py-2 text-sm text-[#22393c] focus:outline-none focus:border-[#46707e]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <button
                type="submit"
                disabled={submitting || draft.trim().length === 0}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ background: "#46707e", fontFamily: "var(--font-inter)" }}
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </form>
          )}

          {error && <p className="text-xs text-[#c0765c] mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
